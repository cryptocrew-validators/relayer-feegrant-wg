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
    labelNames: ['granter'],
});

const granterTotalGrantsGauge = new Gauge({
    name: 'granter_total_grants',
    help: 'Total number of grants issued by the granter',
    labelNames: ['granter'],
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
        const balance = response.data.balances[0].amount; 
        granterBalanceGauge.labels(granterAddress).set(parseInt(balance));
    } catch (error) {
        console.error('[ERR] Error fetching granter balance:', error);
    }
}

export async function fetchFeegrantData() {
    const granterAddress = config.granter_address;
    let nextKey = null;
    do {
        const feegrantUrl = `${config.rest_url}/cosmos/feegrant/v1beta1/issued/${granterAddress}` + (nextKey ? `?pagination.key=${nextKey}` : '');
        try {
            const response = await axios.get(feegrantUrl);
            const allowances = response.data.allowances;
            nextKey = response.data.pagination?.next_key || null;
            granterTotalGrantsGauge.labels(granterAddress).set(allowances.length);

            allowances.forEach(allowance => {
                const grantee = allowance.grantee;
                console.log(`[INFO] Processing allowance for grantee: ${grantee}`);

                const allowanceData = allowance.allowance;
                const allowanceType = allowanceData['@type'];

                if (allowanceType.includes('AllowedMsgAllowance')) {
                    allowanceData.allowed_messages.forEach(message => {
                        granteeAllowedMessageGauge.labels(grantee, message).set(1);
                    });
                    processAllowance(grantee, allowanceData.allowance);
                } else {
                    processAllowance(grantee, allowanceData);
                }
            });

            fetchGranterBalance(granterAddress);
            console.log('[INFO] Updated feegrant data.');
        } catch (error) {
            console.error('[ERR] Error fetching feegrant data:', error);
            break;
        }
    } while (nextKey);
}


function processAllowance(grantee, allowance) {
    const allowanceType = allowance['@type'];
    let spendLimit = 0;
    let totalExpirationTimestamp = 0;
    let periodSpendLimit = 0;
    let periodCanSpend = 0;
    let periodSpent = 0;
    let expirationTimestamp = 0;
    let periodDurationSeconds = 0;
    
    // Handle BasicAllowance
    if (allowanceType.includes('BasicAllowance')) {
        spendLimit = allowance.spend_limit?.[0]?.amount || 0;
        totalExpirationTimestamp = allowance.expiration ? new Date(allowance.expiration).getTime() : 0;
    }

    // Handle PeriodicAllowance
    if (allowanceType.includes('PeriodicAllowance')) {
        periodSpendLimit = allowance.period_spend_limit?.[0]?.amount || 0;
        periodCanSpend = allowance.period_can_spend?.[0]?.amount || 0;
        periodSpent = parseInt(periodSpendLimit) - parseInt(periodCanSpend);
        expirationTimestamp = allowance.period_reset ? new Date(allowance.period_reset).getTime() : 0;
        periodDurationSeconds = parseDuration(allowance.period);
    }

    granteeTotalLimitGauge.labels(grantee).set(parseInt(spendLimit));
    granteeTotalExpirationTimestampGauge.labels(grantee).set(totalExpirationTimestamp);
    granteePeriodLimitGauge.labels(grantee).set(parseInt(periodSpendLimit));
    granteePeriodSpentGauge.labels(grantee).set(periodSpent);
    granteePeriodExpirationTimestampGauge.labels(grantee).set(expirationTimestamp);
    granteePeriodDurationGauge.labels(grantee).set(periodDurationSeconds);
}