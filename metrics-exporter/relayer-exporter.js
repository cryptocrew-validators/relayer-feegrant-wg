import prometheus from 'prom-client';
import sqlite3 from 'sqlite3';
import moment from 'moment/moment.js';
import metrics from './metrics-relayer.js';

const register = prometheus.register;
const db = new sqlite3.Database('./relayerMetrics.db', sqlite3.OPEN_READONLY);

// Register Prometheus Gauges
Object.values(metrics).forEach(metric => {
  register.registerMetric(metric);
});

// Function to update metrics
export async function updateAllMetrics() {
  let lastBlockTime;
  try {
    const lastBlockRow = await db.get("SELECT MAX(block_time) as last_block_time FROM last_block");
    lastBlockTime = lastBlockRow.last_block_time;
  } catch (err) {
    console.error('[ERR] Error fetching last block time', err.message);
    return;
  }

  // Calculate 'yesterday' based on lastBlockTime
  const lastBlockMoment = moment(lastBlockTime);
  const yesterday = lastBlockMoment.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss');

  // Update granteeTotalTxs
  db.all("SELECT relayer_address, memo, COUNT(*) as tx_count FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTotalTxsGauge.labels(row.relayer_address, row.memo).set(row.tx_count);
    });
  });

  // Update granteeTotalTxs24h
  db.all(`SELECT relayer_address, memo, COUNT(*) as tx_count FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTotalTxs24hGauge.labels(row.relayer_address, row.memo).set(row.tx_count);
    });
  });

  // Update granteeAvgGasWanted
  db.all("SELECT relayer_address, memo, AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasWantedGauge.labels(row.relayer_address, row.memo).set(row.avg_gas_wanted);
    });
  });

  // Update granteeAvgGasWanted24h
  db.all(`SELECT relayer_address, memo, AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasWanted24hGauge.labels(row.relayer_address, row.memo).set(row.avg_gas_wanted);
    });
  });

  // Update granteeMaxGasWanted
  db.all("SELECT relayer_address, memo, MAX(gas_wanted) as top_gas_wanted FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeMaxGasWantedGauge.labels(row.relayer_address, row.memo).set(row.top_gas_wanted);
    });
  });

  // Update granteeMaxGasWanted24h
  db.all(`SELECT relayer_address, memo, MAX(gas_wanted) as top_gas_wanted FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeMaxGasWanted24hGauge.labels(row.relayer_address, row.memo).set(row.top_gas_wanted);
    });
  });

  // Update granteeAvgGasUsed
  db.all("SELECT relayer_address, memo, AVG(gas_used) as avg_gas_used FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasUsedGauge.labels(row.relayer_address, row.memo).set(row.avg_gas_used);
    });
  });

  // Update granteeAvgGasUsed24h
  db.all(`SELECT relayer_address, memo, AVG(gas_used) as avg_gas_used FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasUsed24hGauge.labels(row.relayer_address, row.memo).set(row.avg_gas_used);
    });
  });

  // Update granteeMaxGasUsed
  db.all("SELECT relayer_address, memo, MAX(gas_used) as top_gas_used FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeMaxGasUsedGauge.labels(row.relayer_address, row.memo).set(row.top_gas_used);
    });
  });

  // Update granteeMaxGasUsed24h
  db.all(`SELECT relayer_address, memo, MAX(gas_used) as top_gas_used FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeMaxGasUsed24hGauge.labels(row.relayer_address, row.memo).set(row.top_gas_used);
    });
  });

  // Update granteeAvgFeeSpent
  db.all("SELECT relayer_address, memo, AVG(fee_amount) as avg_fee_spent FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgFeeSpentGauge.labels(row.relayer_address, row.memo).set(row.avg_fee_spent);
    });
  });

  // Update granteeAvgFeeSpent24h
  db.all(`SELECT relayer_address, memo, AVG(fee_amount) as avg_fee_spent FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgFeeSpent24hGauge.labels(row.relayer_address, row.memo).set(row.avg_fee_spent);
    });
  });

  // Update granteeMaxFeeSpent
  db.all("SELECT relayer_address, memo, MAX(fee_amount) as top_fee_spent FROM relayer_transactions GROUP BY relayer_address, memo", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeMaxFeeSpentGauge.labels(row.relayer_address, row.memo).set(row.top_fee_spent);
    });
  });

  // Update granteeMaxFeeSpent24h
  db.all(`SELECT relayer_address, memo, MAX(fee_amount) as top_fee_spent FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address, memo`, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeMaxFeeSpent24hGauge.labels(row.relayer_address, row.memo).set(row.top_fee_spent);
    });
  });

  // Update avgGasWantedGauge
  db.all("SELECT AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasWantedGauge.set(row.avg_gas_wanted);
    });
  });

  // Update avgGasWanted24hGauge
  db.all("SELECT AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasWanted24hGauge.set(row.avg_gas_wanted);
    });
  });

  // Update totalGasWantedGauge
  db.all("SELECT SUM(gas_wanted) as total_gas_wanted FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasWantedGauge.set(row.total_gas_wanted);
    });
  });

  // Update totalGasWanted24hGauge
  db.all("SELECT SUM(gas_wanted) as total_gas_wanted FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasWanted24hGauge.set(row.total_gas_wanted);
    });
  });

  // Update avgGasUsedGauge
  db.all("SELECT AVG(gas_used) as avg_gas_used FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasUsedGauge.set(row.avg_gas_used);
    });
  });

  // Update avgGasUsed24hGauge
  db.all("SELECT AVG(gas_used) as avg_gas_used FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasUsed24hGauge.set(row.avg_gas_used);
    });
  });

  // Update totalGasUsedGauge
  db.all("SELECT SUM(gas_used) as total_gas_used FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasUsedGauge.set(row.total_gas_used);
    });
  });

  // Update totalGasUsed24hGauge
  db.all("SELECT SUM(gas_used) as total_gas_used FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasUsed24hGauge.set(row.total_gas_used);
    });
  });

  // Update avgFeeSpentGauge
  db.all("SELECT AVG(fee_amount) as avg_fee_spent FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.avgFeeSpentGauge.set(row.avg_fee_spent);
    });
  });

  // Update avgFeeSpent24hGauge
  db.all("SELECT AVG(fee_amount) as avg_fee_spent FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.avgFeeSpent24hGauge.set(row.avg_fee_spent);
    });
  });

  // Update totalFeeSpentGauge
  db.all("SELECT SUM(fee_amount) as total_fee_spent FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalFeeSpentGauge.set(row.total_fee_spent);
    });
  });

  // Update totalFeeSpent24hGauge
  db.all("SELECT SUM(fee_amount) as total_fee_spent FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalFeeSpent24hGauge.set(row.total_fee_spent);
    });
  });

  // Update totalTxsGauge
  db.all("SELECT COUNT(*) as total_txs FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalTxsGauge.set(row.total_txs);
    });
  });

  // Update totalTxs24hGauge
  db.all("SELECT COUNT(*) as total_txs FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.totalTxs24hGauge.set(row.total_txs);
    });
  });

  // Initialize granteeTotalMisbehaviourTxs to 0 for all grantees
  db.all("SELECT DISTINCT relayer_address FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error fetching grantees', err.message);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTotalMisbehaviourTxs.labels(row.relayer_address, "").set(0);
    });
  });

  // Update granteeLastGasWantedGauge, granteeLastGasUsedGauge, granteeLastFeeSpentGauge
  db.each(`
  SELECT r.relayer_address, r.memo, r.gas_wanted, r.gas_used, r.fee_amount 
  FROM relayer_transactions r
  INNER JOIN (
    SELECT relayer_address, memo, MAX(block_time) as latest_time 
    FROM relayer_transactions 
    GROUP BY relayer_address, memo
  ) latest ON r.relayer_address = latest.relayer_address AND r.memo = latest.memo AND r.block_time = latest.latest_time  
  `, [], (err, row) => {
    if (err) {
        console.error('[ERR] Error running query for last metrics', err.message);
        return;
    }
    metrics.granteeLastGasWantedGauge.labels(row.relayer_address, row.memo).set(row.gas_wanted);
    metrics.granteeLastGasUsedGauge.labels(row.relayer_address, row.memo).set(row.gas_used);
    metrics.granteeLastFeeSpentGauge.labels(row.relayer_address, row.memo).set(row.fee_amount);
  });

  // Update granteeTotalMisbehaviourTxs with actual misbehaviours
  db.all("SELECT grantee_address, msg_array FROM grantee_misbehaviors", [], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query for grantee misbehaviors', err.message);
      return;
    }
  
    if (rows.length === 0) {
      console.log('[INFO] No data found for grantee misbehaviors');
      return;
    }

    const aggregateCounts = {};
    rows.forEach(row => {
      try {
        const msgTypes = JSON.parse(row.msg_array);
  
        msgTypes.forEach(msgType => {
          if (!aggregateCounts[row.grantee_address]) {
            aggregateCounts[row.grantee_address] = {};
          }
          aggregateCounts[row.grantee_address][msgType] = (aggregateCounts[row.grantee_address][msgType] || 0) + 1;
        });
  
      } catch (parseError) {
        console.error(`[ERR] Error parsing msg_array for grantee_address ${row.grantee_address}:`, parseError);
      }
    });

    Object.entries(aggregateCounts).forEach(([grantee, counts]) => {
      Object.entries(counts).forEach(([msgType, count]) => {
        metrics.granteeTotalMisbehaviourTxs.labels(grantee, msgType).set(count);
      });
    });
  });

  // Update granteeLastNumMsgsGauge
  db.each(`
  SELECT t.relayer_address, t.memo, t.msg_array
  FROM relayer_transactions t
  INNER JOIN (
    SELECT relayer_address, memo, MAX(block_time) as latest_time 
    FROM relayer_transactions 
    GROUP BY relayer_address, memo
  ) latest ON t.relayer_address = latest.relayer_address AND t.memo = latest.memo AND t.block_time = latest.latest_time
  `, [], (err, row) => {
    if (err) {
      console.error('[ERR] Error running query for last number of messages', err.message);
      return;
    }
    try {
      const msgCount = JSON.parse(row.msg_array).length;
      metrics.granteeLastNumMsgsGauge.labels(row.relayer_address, row.memo).set(msgCount);
    } catch (parseError) {
      console.error('[ERR] Error parsing msg_array:', parseError);
    }
  });

  // Update granteeAvgNumMsgs24hGauge
  db.all(`
  SELECT relayer_address, memo, msg_array
  FROM relayer_transactions
  WHERE block_time > ?
  `, [yesterday], (err, rows) => {
    if (err) {
      console.error('[ERR] Error running query for average number of messages in 24h', err.message);
      return;
    }

    const granteeMsgCounts = {};
    rows.forEach(row => {
      try {
        const msgCount = JSON.parse(row.msg_array).length;
        if (!granteeMsgCounts[row.relayer_address]) {
          granteeMsgCounts[row.relayer_address] = { totalMsgs: 0, txCount: 0, memo: row.memo };
        }
        granteeMsgCounts[row.relayer_address].totalMsgs += msgCount;
        granteeMsgCounts[row.relayer_address].txCount += 1;
      } catch (parseError) {
        console.error('[ERR] Error parsing msg_array:', parseError);
      }
    });

    for (const [relayer_address, data] of Object.entries(granteeMsgCounts)) {
      const avgMsgs = data.totalMsgs / data.txCount;
      metrics.granteeAvgNumMsgs24hGauge.labels(relayer_address, data.memo).set(avgMsgs);
    }
  });

  // Update total top3 message types for each grantee
  processMessageTypesForGauge(metrics.granteeTopMsgTypesTotalGauge);

  // Update last 24h top3 message types for each grantee
  processMessageTypesForGauge(metrics.granteeTopMsgTypes24hGauge, yesterday);

  return register;
}

function processMessageTypesForGauge(gauge, yesterday = null) {
  const timeCondition = yesterday ? `WHERE block_time > '${yesterday}'` : '';
  const sql = `SELECT relayer_address, msg_array, memo FROM relayer_transactions ${timeCondition}`;

  db.all(sql, [], (err, rows) => {
      if (err) {
          console.error(`[ERR] Error running query for msg types ${yesterday ? '24h' : 'total'}`, err.message);
          return;
      }

      if (rows.length === 0) {
          console.log(`[INFO] No data found for ${yesterday ? '24h' : 'total'} message types`);
          return;
      }

      let messageTypeCounts = {};
      rows.forEach(row => {
          try {
              const msgTypes = JSON.parse(row.msg_array);
              msgTypes.forEach(msgType => {
                  if (!messageTypeCounts[row.relayer_address]) {
                      messageTypeCounts[row.relayer_address] = { msgs: {}, memo: row.memo };
                  }
                  if (!messageTypeCounts[row.relayer_address].msgs[msgType]) {
                      messageTypeCounts[row.relayer_address].msgs[msgType] = 0;
                  }
                  messageTypeCounts[row.relayer_address].msgs[msgType]++;
              });
          } catch (parseError) {
              console.error(`[ERR] Error parsing msg_array for relayer_address ${row.relayer_address}:`, parseError);
          }
      });

      updateGaugeWithTop3(gauge, messageTypeCounts);
  });
}

function updateGaugeWithTop3(gauge, messageTypeCounts) {
  Object.entries(messageTypeCounts).forEach(([relayer_address, data]) => {
      const sortedMsgTypes = Object.entries(data.msgs).sort((a, b) => b[1] - a[1]).slice(0, 3);
      sortedMsgTypes.forEach(([msgType, count], index) => {
          gauge.labels(relayer_address, msgType, data.memo).set(count);
      });
  });
}

process.on('exit', () => {
  db.close((err) => {
      if (err) {
          console.error('[ERR] ' + err.message);
      }
      console.log('[INFO] Close the database read connection.');
  });
});