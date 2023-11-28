import prometheus from 'prom-client';
import sqlite3 from 'sqlite3';
import moment from 'moment/moment.js';

import metrics from './metrics.js';

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
    console.error('Error fetching last block time', err);
    return;
  }

  // Calculate 'yesterday' based on lastBlockTime
  const lastBlockMoment = moment(lastBlockTime);
  const yesterday = lastBlockMoment.subtract(24, 'hours').format('YYYY-MM-DD HH:mm:ss');

  // Update granteeTotalTxs
  db.all("SELECT relayer_address, COUNT(*) as tx_count FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTotalTxsGauge.labels(row.relayer_address).set(row.tx_count);
    });
  });

  // Update granteeTotalTxs24h
  db.all(`SELECT relayer_address, COUNT(*) as tx_count FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTotalTxs24hGauge.labels(row.relayer_address).set(row.tx_count);
    });
  });

  // Update granteeAvgGasWanted
  db.all("SELECT relayer_address, AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasWantedGauge.labels(row.relayer_address).set(row.avg_gas_wanted);
    });
  });

  // Update granteeAvgGasWanted24h
  db.all(`SELECT relayer_address, AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasWanted24hGauge.labels(row.relayer_address).set(row.avg_gas_wanted);
    });
  });

  // Update granteeTopGasWanted
  db.all("SELECT relayer_address, MAX(gas_wanted) as top_gas_wanted FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTopGasWantedGauge.labels(row.relayer_address).set(row.top_gas_wanted);
    });
  });

  // Update granteeTopGasWanted24h
  db.all(`SELECT relayer_address, MAX(gas_wanted) as top_gas_wanted FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTopGasWanted24hGauge.labels(row.relayer_address).set(row.top_gas_wanted);
    });
  });

  // Update granteeAvgGasUsed
  db.all("SELECT relayer_address, AVG(gas_used) as avg_gas_used FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasUsedGauge.labels(row.relayer_address).set(row.avg_gas_used);
    });
  });

  // Update granteeAvgGasUsed24h
  db.all(`SELECT relayer_address, AVG(gas_used) as avg_gas_used FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgGasUsed24hGauge.labels(row.relayer_address).set(row.avg_gas_used);
    });
  });

  // Update granteeTopGasUsed
  db.all("SELECT relayer_address, MAX(gas_used) as top_gas_used FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTopGasUsedGauge.labels(row.relayer_address).set(row.top_gas_used);
    });
  });

  // Update granteeTopGasUsed24h
  db.all(`SELECT relayer_address, MAX(gas_used) as top_gas_used FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTopGasUsed24hGauge.labels(row.relayer_address).set(row.top_gas_used);
    });
  });

  // Update granteeAvgFeeSpent
  db.all("SELECT relayer_address, AVG(fee_amount) as avg_fee_spent FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgFeeSpentGauge.labels(row.relayer_address).set(row.avg_fee_spent);
    });
  });

  // Update granteeAvgFeeSpent24h
  db.all(`SELECT relayer_address, AVG(fee_amount) as avg_fee_spent FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeAvgFeeSpent24hGauge.labels(row.relayer_address).set(row.avg_fee_spent);
    });
  });

  // Update granteeTopFeeSpent
  db.all("SELECT relayer_address, MAX(fee_amount) as top_fee_spent FROM relayer_transactions GROUP BY relayer_address", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTopFeeSpentGauge.labels(row.relayer_address).set(row.top_fee_spent);
    });
  });

  // Update granteeTopFeeSpent24h
  db.all(`SELECT relayer_address, MAX(fee_amount) as top_fee_spent FROM relayer_transactions WHERE block_time > ? GROUP BY relayer_address`, [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.granteeTopFeeSpent24hGauge.labels(row.relayer_address).set(row.top_fee_spent);
    });
  });

  // Update avgGasWantedGauge
  db.all("SELECT AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasWantedGauge.set(row.avg_gas_wanted);
    });
  });

  // Update avgGasWanted24hGauge
  db.all("SELECT AVG(gas_wanted) as avg_gas_wanted FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasWanted24hGauge.set(row.avg_gas_wanted);
    });
  });

  // Update totalGasWantedGauge
  db.all("SELECT SUM(gas_wanted) as total_gas_wanted FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasWantedGauge.set(row.total_gas_wanted);
    });
  });

  // Update totalGasWanted24hGauge
  db.all("SELECT SUM(gas_wanted) as total_gas_wanted FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasWanted24hGauge.set(row.total_gas_wanted);
    });
  });

  // Update avgGasUsedGauge
  db.all("SELECT AVG(gas_used) as avg_gas_used FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasUsedGauge.set(row.avg_gas_used);
    });
  });

  // Update avgGasUsed24hGauge
  db.all("SELECT AVG(gas_used) as avg_gas_used FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.avgGasUsed24hGauge.set(row.avg_gas_used);
    });
  });

  // Update totalGasUsedGauge
  db.all("SELECT SUM(gas_used) as total_gas_used FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasUsedGauge.set(row.total_gas_used);
    });
  });

  // Update totalGasUsed24hGauge
  db.all("SELECT SUM(gas_used) as total_gas_used FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalGasUsed24hGauge.set(row.total_gas_used);
    });
  });

  // Update avgFeeSpentGauge
  db.all("SELECT AVG(fee_amount) as avg_fee_spent FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.avgFeeSpentGauge.set(row.avg_fee_spent);
    });
  });

  // Update avgFeeSpent24hGauge
  db.all("SELECT AVG(fee_amount) as avg_fee_spent FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.avgFeeSpent24hGauge.set(row.avg_fee_spent);
    });
  });

  // Update totalFeeSpentGauge
  db.all("SELECT SUM(fee_amount) as total_fee_spent FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalFeeSpentGauge.set(row.total_fee_spent);
    });
  });

  // Update totalFeeSpent24hGauge
  db.all("SELECT SUM(fee_amount) as total_fee_spent FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalFeeSpent24hGauge.set(row.total_fee_spent);
    });
  });

  // Update totalTxsGauge
  db.all("SELECT COUNT(*) as total_txs FROM relayer_transactions", [], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalTxsGauge.set(row.total_txs);
    });
  });

  // Update totalTxs24hGauge
  db.all("SELECT COUNT(*) as total_txs FROM relayer_transactions WHERE block_time > ?", [yesterday], (err, rows) => {
    if (err) {
      console.error('Error running query', err);
      return;
    }
    rows.forEach((row) => {
      metrics.totalTxsGauge.set(row.total_txs);
    });
  });

  return register;
}

process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database read connection.');
  });
});