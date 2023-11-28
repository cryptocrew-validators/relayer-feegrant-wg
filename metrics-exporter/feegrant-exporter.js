import axios from 'axios';
import prometheus from 'prom-client';
import express from 'express';

import config from './config.js';

const app = express();
const Gauge = prometheus.Gauge;
const register = prometheus.register;

// Prometheus Metrics
const granterBalanceGauge = new Gauge({
    name: 'granter_balance',
    help: 'Balance of the granter',
});

const granterTotalGrantsGauge = new Gauge({
    name: 'granter_total_grants',
    help: 'Total number of grants issued by the granter',
});

const granteeTotalLimitGauge = new Gauge({
    name: 'grantee_total_limit',
    help: 'Total spend limit for each grantee',
    labelNames: ['grantee'],
});

const granteeTotalSpentGauge = new Gauge({
    name: 'grantee_total_spent',
    help: 'Total amount spent by each grantee',
    labelNames: ['grantee'],
});

const granteePeriodDurationGauge = new Gauge({
    name: 'grantee_period_duration',
    help: 'Duration of each grantee’s period',
    labelNames: ['grantee'],
});

const granteePeriodLimitGauge = new Gauge({
    name: 'grantee_period_limit',
    help: 'Spend limit for each grantee in a period',
    labelNames: ['grantee'],
});

const granteePeriodSpentGauge = new Gauge({
    name: 'grantee_period_spent',
    help: 'Amount spent by each grantee in a period',
    labelNames: ['grantee'],
});

const granteeAllowedMessageGauge = new Gauge({
    name: 'grantee_allowed_message',
    help: 'Allowed messages for each grantee',
    labelNames: ['grantee', 'message'],
});

const granteePeriodExpirationTimestampGauge = new Gauge({
    name: 'grantee_period_expiration_timestamp',
    help: 'Expiration timestamp of each grantee’s period',
    labelNames: ['grantee'],
});

const granteeTotalExpirationTimestampGauge = new Gauge({
    name: 'grantee_total_expiration_timestamp',
    help: 'Expiration timestamp of each grantee’s total allowance',
    labelNames: ['grantee'],
});

register.registerMetric(granterBalanceGauge);
register.registerMetric(granterTotalGrantsGauge);
register.registerMetric(granteeTotalLimitGauge);
register.registerMetric(granteeTotalSpentGauge);
register.registerMetric(granteePeriodDurationGauge);
register.registerMetric(granteePeriodExpirationTimestampGauge);
register.registerMetric(granteePeriodLimitGauge);
register.registerMetric(granteePeriodSpentGauge);
register.registerMetric(granteeAllowedMessageGauge);
register.registerMetric(granteeTotalExpirationTimestampGauge);

// Helper function to parse duration string into seconds
function parseDuration(duration) {
    const match = duration.match(/(\d+)([smhd])/);
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 3600;
        case 'd': return value * 86400;
        default: return 0;
    }
}

// Fetch granter balance
async function fetchGranterBalance(granterAddress) {
    const bankUrl = `${config.rest_url}/cosmos/bank/v1beta1/balances/${granterAddress}`;
    try {
        const response = await axios.get(bankUrl);
        const balance = response.data.balances[0].amount; // assuming the balance is in the first object
        granterBalanceGauge.set(parseInt(balance));
    } catch (error) {
        console.error('Error fetching granter balance:', error);
    }
}

// Fetch and process feegrant data
async function fetchFeegrantData() {
    const granterAddress = config.granter_address;
    const feegrantUrl = `${config.rest_url}/cosmos/feegrant/v1beta1/issued/${granterAddress}`;
    try {
        const response = await axios.get(feegrantUrl);
        const allowances = response.data.allowances;
        granterTotalGrantsGauge.set(allowances.length);

        allowances.forEach(allowance => {
            const grantee = allowance.grantee;
            const outerAllowance = allowance.allowance;
            const allowanceType = outerAllowance['@type'];

            if (allowanceType.includes('AllowedMsgAllowance')) {
                const innerAllowance = outerAllowance.allowance;
                const innerAllowanceType = innerAllowance['@type'];

                // Update for allowed messages
                outerAllowance.allowed_messages.forEach(message => {
                    granteeAllowedMessageGauge.labels(grantee, message).set(1);
                });

                // Handle BasicAllowance
                if (innerAllowanceType.includes('BasicAllowance')) {
                    const spendLimit = innerAllowance.spend_limit?.[0]?.amount || 0;
                    const totalExpirationTimestamp = innerAllowance.expiration ? new Date(innerAllowance.expiration).getTime() : 0;

                    granteeTotalLimitGauge.labels(grantee).set(parseInt(spendLimit));
                    granteeTotalExpirationTimestampGauge.labels(grantee).set(totalExpirationTimestamp);
                }

                // Handle PeriodicAllowance
                if (innerAllowanceType.includes('PeriodicAllowance')) {
                    const periodSpendLimit = innerAllowance.period_spend_limit?.[0]?.amount || 0;
                    const periodCanSpend = innerAllowance.period_can_spend?.[0]?.amount || 0;
                    const periodSpent = parseInt(periodSpendLimit) - parseInt(periodCanSpend);
                    const expirationTimestamp = innerAllowance.period_reset ? new Date(innerAllowance.period_reset).getTime() : 0;
                    const periodDurationSeconds = parseDuration(innerAllowance.period);

                    granteePeriodLimitGauge.labels(grantee).set(parseInt(periodSpendLimit));
                    granteePeriodSpentGauge.labels(grantee).set(periodSpent);
                    granteePeriodExpirationTimestampGauge.labels(grantee).set(expirationTimestamp);
                    granteePeriodDurationGauge.labels(grantee).set(periodDurationSeconds);
                }
            }
        });

        // Fetch granter balance
        fetchGranterBalance(granterAddress);

    } catch (error) {
        console.error('Error fetching feegrant data:', error);
    }
}

// Schedule data fetching
await fetchFeegrantData();
setInterval(fetchFeegrantData, 10000); // every 10 seconds

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const port = config.feegrant_exporter_port;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});