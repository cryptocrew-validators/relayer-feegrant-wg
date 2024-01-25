import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./relayerMetrics.db', (err) => {
  if (err) {
    console.error('[ERR] ' + err.message);
  }
  console.log('[INFO] Connected to the relayer metrics SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS relayer_transactions (
      block_height INTEGER,
      block_time TEXT,
      relayer_address TEXT,
      msg_array TXT,
      gas_wanted INTEGER,
      gas_used INTEGER,
      fee_amount INTEGER,
      gas_price REAL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS total_metrics (
      block_height INTEGER,
      block_time TEXT,
      total_gas_wanted INTEGER,
      total_gas_used INTEGER,
      total_fee INTEGER,
      transaction_count INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS last_block (
      block_height INTEGER,
      block_time TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS grantee_misbehaviors (
      block_height INTEGER,
      block_time TEXT,
      grantee_address TEXT,
      msg_array TEXT
    )`);
});

export async function saveTransactionData(blockHeight, blockTime, relayerAddress, msgArray, gasWanted, gasUsed, feeAmount, gasPrice) {
    db.run(`INSERT INTO relayer_transactions (
      block_height, 
      block_time, 
      relayer_address, 
      msg_array, 
      gas_wanted, 
      gas_used, 
      fee_amount, 
      gas_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            blockHeight,
            blockTime,
            relayerAddress,
            msgArray,
            gasWanted,
            gasUsed,
            feeAmount,
            gasPrice
        ], (err) => {
            if (err) {
                console.error('[ERR] ' + err.message);
            }
        });
    console.log(`[DEBUG] saved relayer_transaction for: ${relayerAddress}`);
    return;
}

export async function saveTotalMetricsData(blockHeight, blockTime, totalGasWanted, totalGasUsed, totalFee, transactionCount) {
    db.run(`INSERT INTO total_metrics (
      block_height, 
      block_time, 
      total_gas_wanted, 
      total_gas_used, 
      total_fee, 
      transaction_count
      ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            blockHeight,
            blockTime,
            totalGasWanted,
            totalGasUsed,
            totalFee,
            transactionCount
        ], (err) => {
            if (err) {
                console.error('[ERR] ' + err.message);
            }
        });
    console.log(`[DEBUG] saved total_metrics.`);
    return;
}

export async function saveLastBlockData(blockHeight, blockTime) {
    db.run(`INSERT INTO last_block (
      block_height, 
      block_time
      ) VALUES (?, ?)`,
        [
            blockHeight,
            blockTime
        ], (err) => {
            if (err) {
                console.error('[ERR] ' + err.message);
            }
        });
    return;
}

export async function saveGranteeMisbehaviorData(blockHeight, blockTime, granteeAddress, typeString) {
    db.run(`INSERT INTO grantee_misbehaviors (
      block_height, 
      block_time, 
      grantee_address, 
      msg_array
      ) VALUES (?, ?, ?, ?)`,
        [
            blockHeight,
            blockTime,
            granteeAddress,
            typeString
        ], (err) => {
            if (err) {
                console.error('[ERR] ' + err.message);
            }
        });
    return;
}

export async function getLatestBlockHeightFromDB() {
    try {
        const row = await new Promise((resolve, reject) => {
            db.get("SELECT MAX(block_height) as max_height FROM last_block", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        return row ? row.max_height : config.indexer_start_block_height;
    } catch (error) {
        console.error('[ERR] Error fetching latest block height from database:', error);
        return false;
    }
}

process.on('exit', () => {
    db.close((err) => {
      if (err) {
        console.error('[ERR] ' + err.message);
      }
      console.log('[INFO] Close the database write connection.');
    });
  });
