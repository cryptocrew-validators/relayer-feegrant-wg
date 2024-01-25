import prometheus from 'prom-client';

// Prometheus Gauges for each metric
export default {
    granterBalanceGauge: new prometheus.Gauge({
        name: 'granter_balance',
        help: 'Balance of the granter',
        labelNames: ['granter'],
    }),
    granterTotalGrantsGauge: new prometheus.Gauge({
        name: 'granter_total_grants',
        help: 'Total number of grants issued by the granter',
        labelNames: ['granter'],
    }),
    granteeTotalLimitGauge: new prometheus.Gauge({
        name: 'grantee_total_limit',
        help: 'Total spend limit for each grantee',
        labelNames: ['grantee'],
    }),
    granteeTotalSpentGauge: new prometheus.Gauge({
        name: 'grantee_total_spent',
        help: 'Total amount spent by each grantee',
        labelNames: ['grantee'],
    }),
    granteePeriodDurationGauge: new prometheus.Gauge({
        name: 'grantee_period_duration',
        help: 'Duration of each grantee’s period',
        labelNames: ['grantee'],
    }),
    granteePeriodLimitGauge: new prometheus.Gauge({
        name: 'grantee_period_limit',
        help: 'Spend limit for each grantee in a period',
        labelNames: ['grantee'],
    }),
    granteePeriodSpentGauge: new prometheus.Gauge({
        name: 'grantee_period_spent',
        help: 'Amount spent by each grantee in a period',
        labelNames: ['grantee'],
    }),
    granteeAllowedMessageGauge: new prometheus.Gauge({
        name: 'grantee_allowed_message',
        help: 'Allowed messages for each grantee',
        labelNames: ['grantee', 'message'],
    }),
    granteePeriodExpirationTimestampGauge: new prometheus.Gauge({
        name: 'grantee_period_expiration_timestamp',
        help: 'Expiration timestamp of each grantee’s period',
        labelNames: ['grantee'],
    }),
    granteeTotalExpirationTimestampGauge: new prometheus.Gauge({
        name: 'grantee_total_expiration_timestamp',
        help: 'Expiration timestamp of each grantee’s total allowance',
        labelNames: ['grantee'],
    }),
};
