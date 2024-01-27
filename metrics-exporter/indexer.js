import axios from 'axios';
import config from './config.js';
import { 
  saveTransactionData,
  saveTotalMetricsData,
  saveGranteeMisbehaviorData,
  saveLastBlockData,
  getLatestBlockHeightFromDB
} from './db.js'

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { Tx } = require('cosmjs-types/cosmos/tx/v1beta1/tx.js');
const { PubKey } = require('cosmjs-types/cosmos/crypto/secp256k1/keys.js');
const { pubkeyToAddress } = require('@cosmjs/amino');

let latestBlockHeight = 0;
let latestBlockTime = "";
let isCatchingUp = true;
let totalGasWanted = 0;
let totalGasUsed = 0;
let totalFee = 0;
let transactionCount = 0;

async function getBlock(height) {
  try {
    const response = await axios.get(`${config.rpc_url}/block?height=${height}`);
    return response.data.result.block;
  } catch (error) {
    console.error(`[ERR] Error fetching block at height ${height}:`, error);
    return null;
  }
}

function deriveAddressFromPubkey(pubkeyValue) {
  let key = PubKey.toJSON(PubKey.decode(pubkeyValue)).key.toString();
  let pubkey = {
      "type": "tendermint/PubKeySecp256k1",
      "value": key
  }
  return pubkeyToAddress(pubkey, config.addr_prefix);
}

async function processTransaction(tx) {
  try {
    let buff = Buffer.from(tx, 'base64');
    let txDecoded = Tx.decode(buff);
    let isRelayerTx = false;
    let typeArray = [];
    let memo = txDecoded.body.memo; // Extract memo from the transaction

    txDecoded.body.messages.forEach((msg) => {
      typeArray.push(msg.typeUrl);
      if (msg.typeUrl.includes('/ibc') && msg.typeUrl != "/ibc.applications.transfer.v1.MsgTransfer") {
        isRelayerTx = true;
      }
    });

    if (isRelayerTx && txDecoded.authInfo.fee.granter == config.granter_address) {
      // This is regular relaying transaction using the granter
      const gasWanted = parseInt(txDecoded.authInfo.fee.gasLimit || '0', 10);
      const gasUsed = parseInt(txDecoded.authInfo.fee.gasUsed || '0', 10); // this always returns zero: how do we correctly get the gas used for the tx?
      const feeAmount = parseInt(txDecoded.authInfo.fee.amount?.[0]?.amount || '0');
      const gasPrice = feeAmount / gasWanted;

      const relayerAdress = deriveAddressFromPubkey(txDecoded.authInfo.signerInfos[0].publicKey.value);

      await saveTransactionData(
        parseInt(latestBlockHeight), 
        latestBlockTime,
        relayerAdress,
        JSON.stringify(typeArray),
        gasWanted,
        gasUsed,
        feeAmount,
        gasPrice,
        memo
      );

      totalGasWanted += gasWanted;
      totalGasUsed += gasUsed;
      totalFee += parseInt(feeAmount, 10);
      transactionCount++;
      return true;
    } 
    if (!isRelayerTx && txDecoded.authInfo.fee.granter == config.granter_address) {
      // This is a misbehaving transaction using the granter
      const granteeAddress = deriveAddressFromPubkey(txDecoded.authInfo.signerInfos[0].publicKey.value);
      const typeString = '[' + typeArray.map(type => `"${type}"`).join(', ') + ']';

      await saveGranteeMisbehaviorData(
        parseInt(latestBlockHeight), 
        latestBlockTime, 
        granteeAddress,
        typeString
      );

      granteeTotalMisbehaviourTxs.labels(granteeAddress, typeString).inc();
    }
  } catch (error) {
    console.error('[ERR] Error processing transaction:', error);
  }
  return false;
}

async function processBlock(blockData) {
  let txs = blockData.txs;
  let blockHasRelayerTx = false;
  let isRelayerTx = false;
  if (txs) {
    for (const tx of txs) {
      isRelayerTx = await processTransaction(tx);
      if (isRelayerTx) {
        blockHasRelayerTx = true;
      }
    };
  }
  if (blockHasRelayerTx) {
    await saveTotalMetricsData(
      parseInt(latestBlockHeight),
      latestBlockTime,
      totalGasWanted,
      totalGasUsed,
      totalFee,
      transactionCount
    );
    
    totalGasWanted = 0;
    totalGasUsed = 0;
    totalFee = 0;
    transactionCount = 0;
  }

  return;
}

async function updateLatestBlockHeight() {
  try {
    const response = await axios.get(`${config.rpc_url}/block`);
    latestBlockHeight = parseInt(response.data.result.block.header.height);
    latestBlockTime = response.data.result.block.header.time;
  } catch (error) {
    console.error('[ERR] Error fetching latest block height:', error);
  }
}

export async function indexer() {
  let currentHeight = await getLatestBlockHeightFromDB();
  if (!currentHeight || currentHeight == 0) {
    console.log('[INFO] Starting indexer from start height: ' + config.indexer_start_block_height);
    currentHeight = parseInt(config.indexer_start_block_height);
  } else {
    console.log('[INFO] Found db entry with height ' + currentHeight + '. Starting indexer.');
    currentHeight++;
  }

  while (isCatchingUp) {
    try {
      const block = await getBlock(currentHeight);
      if (block) {
        await processBlock(block.data);
      }
      await saveLastBlockData(block.header.height, block.header.time);
      console.log('[INFO] processed block: ' + block.header.height + ', header_time: ' + block.header.time);
    } catch (e) {
      console.error('[ERR] ' + e);
    }
    await updateLatestBlockHeight();
    if (currentHeight == latestBlockHeight) {
      isCatchingUp = false;
    }  
    currentHeight++;  
  }

  console.log('[INFO] Indexer caught up, swiching to polling mode.')

  // Polling for new blocks
  setInterval(async () => {
    await updateLatestBlockHeight();
    if (currentHeight <= latestBlockHeight) {
      const block = await getBlock(currentHeight);
      if (block) {
        await processBlock(block.data);
      }   
      await saveLastBlockData(block.header.height, block.header.time);
      console.log('[INFO] processed block: ' + block.header.height + ', header_time: ' + block.header.time);
      currentHeight++;
    }
  }, config.indexer_poll_frequency); 
}