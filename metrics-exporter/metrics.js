import prometheus from 'prom-client';

// Prometheus Gauges for each metric
export default {
    granteeTotalTxsGauge: new prometheus.Gauge({
        name: 'grantee_total_txs',
        help: 'Total transactions by each grantee',
        labelNames: ['grantee'],
    }),
    granteeTotalTxs24hGauge: new prometheus.Gauge({
        name: 'grantee_total_txs_24h',
        help: 'Total transactions by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    granteeAvgGasWantedGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_wanted',
        help: 'Average gas wanted by each grantee',
        labelNames: ['grantee'],
    }),
    granteeAvgGasWanted24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_wanted_24h',
        help: 'Average gas wanted by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    granteeTopGasWantedGauge: new prometheus.Gauge({
        name: 'grantee_top_gas_wanted',
        help: 'Top gas wanted by each grantee',
        labelNames: ['grantee'],
    }),
    granteeTopGasWanted24hGauge: new prometheus.Gauge({
        name: 'grantee_top_gas_wanted_24h',
        help: 'Top gas wanted by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    granteeAvgGasUsedGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_used',
        help: 'Average gas used by each grantee',
        labelNames: ['grantee'],
    }),
    granteeAvgGasUsed24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_used_24h',
        help: 'Average gas used by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    granteeTopGasUsedGauge: new prometheus.Gauge({
        name: 'grantee_top_gas_used',
        help: 'Top gas used by each grantee',
        labelNames: ['grantee'],
    }),
    granteeTopGasUsed24hGauge: new prometheus.Gauge({
        name: 'grantee_top_gas_used_24h',
        help: 'Top gas used by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    granteeAvgFeeSpentGauge: new prometheus.Gauge({
        name: 'grantee_avg_fee_spent',
        help: 'Average fee spent by each grantee',
        labelNames: ['grantee'],
    }),
    granteeAvgFeeSpent24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_fee_spent_24h',
        help: 'Average fee spent by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    granteeTopFeeSpentGauge: new prometheus.Gauge({
        name: 'grantee_top_fee_spent',
        help: 'Top fee spent by each grantee',
        labelNames: ['grantee'],
    }),
    granteeTopFeeSpent24hGauge: new prometheus.Gauge({
        name: 'grantee_top_fee_spent_24h',
        help: 'Top fee spent by each grantee in the last 24 hours',
        labelNames: ['grantee'],
    }),
    avgGasWantedGauge: new prometheus.Gauge({
        name: 'avg_gas_wanted',
        help: 'Average gas wanted across all transactions',
    }),
    avgGasWanted24hGauge: new prometheus.Gauge({
        name: 'avg_gas_wanted_24h',
        help: 'Average gas wanted across all transactions in the last 24 hours',
    }),
    totalGasWantedGauge: new prometheus.Gauge({
        name: 'total_gas_wanted',
        help: 'Total gas wanted across all transactions',
    }),
    totalGasWanted24hGauge: new prometheus.Gauge({
        name: 'total_gas_wanted_24h',
        help: 'Total gas wanted across all transactions in the last 24 hours',
    }),
    avgGasUsedGauge: new prometheus.Gauge({
        name: 'avg_gas_used',
        help: 'Average gas used across all transactions',
    }),
    avgGasUsed24hGauge: new prometheus.Gauge({
        name: 'avg_gas_used_24h',
        help: 'Average gas used across all transactions in the last 24 hours',
    }),
    totalGasUsedGauge: new prometheus.Gauge({
        name: 'total_gas_used',
        help: 'Total gas used across all transactions',
    }),
    totalGasUsed24hGauge: new prometheus.Gauge({
        name: 'total_gas_used_24h',
        help: 'Total gas used across all transactions in the last 24 hours',
    }),
    avgFeeSpentGauge: new prometheus.Gauge({
        name: 'avg_fee_spent',
        help: 'Average fee spent across all transactions',
    }),
    avgFeeSpent24hGauge: new prometheus.Gauge({
        name: 'avg_fee_spent_24h',
        help: 'Average fee spent across all transactions in the last 24 hours',
    }),
    totalFeeSpentGauge: new prometheus.Gauge({
        name: 'total_fee_spent',
        help: 'Total fee spent across all transactions',
    }),
    totalFeeSpent24hGauge: new prometheus.Gauge({
        name: 'total_fee_spent_24h',
        help: 'Total fee spent across all transactions in the last 24 hours',
    }),
    totalTxsGauge: new prometheus.Gauge({
        name: 'total_txs',
        help: 'Total number of transactions',
    }),
    totalTxs24hGauge: new prometheus.Gauge({
        name: 'total_txs_24h',
        help: 'Total number of transactions in the last 24 hours',
    })
};

