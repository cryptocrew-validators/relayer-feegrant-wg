import prometheus from 'prom-client';

// Prometheus Gauges for each metric
export default {
    granteeTotalTxsGauge: new prometheus.Gauge({
        name: 'grantee_total_txs',
        help: 'Total transactions by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeTotalTxs24hGauge: new prometheus.Gauge({
        name: 'grantee_total_txs_24h',
        help: 'Total transactions by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeAvgGasWantedGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_wanted',
        help: 'Average gas wanted by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeAvgGasWanted24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_wanted_24h',
        help: 'Average gas wanted by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeMaxGasWantedGauge: new prometheus.Gauge({
        name: 'grantee_max_gas_wanted',
        help: 'Max gas wanted by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeMaxGasWanted24hGauge: new prometheus.Gauge({
        name: 'grantee_max_gas_wanted_24h',
        help: 'Max gas wanted by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeAvgGasUsedGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_used',
        help: 'Average gas used by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeAvgGasUsed24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_gas_used_24h',
        help: 'Average gas used by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeMaxGasUsedGauge: new prometheus.Gauge({
        name: 'grantee_max_gas_used',
        help: 'Max gas used by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeMaxGasUsed24hGauge: new prometheus.Gauge({
        name: 'grantee_max_gas_used_24h',
        help: 'Max gas used by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeAvgFeeSpentGauge: new prometheus.Gauge({
        name: 'grantee_avg_fee_spent',
        help: 'Average fee spent by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeAvgFeeSpent24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_fee_spent_24h',
        help: 'Average fee spent by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeMaxFeeSpentGauge: new prometheus.Gauge({
        name: 'grantee_max_fee_spent',
        help: 'Max fee spent by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeMaxFeeSpent24hGauge: new prometheus.Gauge({
        name: 'grantee_max_fee_spent_24h',
        help: 'Max fee spent by each grantee in the last 24 hours',
        labelNames: ['grantee', 'memo'],
    }),
    granteeTotalMisbehaviourTxs: new prometheus.Gauge({
        name: 'grantee_total_misbehavior_txs',
        help: 'Total misbehavior transactions by each grantee',
        labelNames: ['grantee', 'msgTypes']
    }),
    granteeLastGasWantedGauge: new prometheus.Gauge({
        name: 'grantee_last_gas_wanted',
        help: 'Last gas wanted by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeLastGasUsedGauge: new prometheus.Gauge({
        name: 'grantee_last_gas_used',
        help: 'Last gas used by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeLastFeeSpentGauge: new prometheus.Gauge({
        name: 'grantee_last_fee_spent',
        help: 'Last fee spent by each grantee',
        labelNames: ['grantee', 'memo'],
    }),
    granteeTopMsgTypesTotalGauge: new prometheus.Gauge({
        name: 'grantee_top_msg_types_total',
        help: 'Total counts of top 3 message types for each grantee',
        labelNames: ['grantee_address', 'msg_type', 'memo']
    }),
    granteeTopMsgTypes24hGauge: new prometheus.Gauge({
        name: 'grantee_top_msg_types_24h',
        help: 'Counts of top 3 message types for each grantee in the last 24 hours',
        labelNames: ['grantee_address', 'msg_type', 'memo']
    }),
    granteeLastNumMsgsGauge: new prometheus.Gauge({
        name: 'grantee_last_num_msgs',
        help: 'Last number of messages used (batched) for each grantee',
        labelNames: ['grantee_address', 'memo']
    }),
    granteeAvgNumMsgs24hGauge: new prometheus.Gauge({
        name: 'grantee_avg_num_msgs_24h',
        help: 'Average number of messages used (batched) for each grantee in the last 24 hours',
        labelNames: ['grantee_address', 'memo']
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

