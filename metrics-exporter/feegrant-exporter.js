import axios from 'axios';
import prometheus from 'prom-client';

import config from './config.js';
import metrics from './metrics-feegrant.js';

const register = prometheus.register;

// Register Prometheus Gauges
Object.values(metrics).forEach(metric => {
    register.registerMetric(metric);
  });  

// Fetch granter balance
async function fetchGranterBalance(granterAddress) {
    const bankUrl = `${config.rest_url}/cosmos/bank/v1beta1/balances/${granterAddress}`;
    try {
        const response = await axios.get(bankUrl);
        const balance = response.data.balances[0].amount; 
        metrics.granterBalanceGauge.labels(granterAddress).set(parseInt(balance));
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
            metrics.granterTotalGrantsGauge.labels(granterAddress).set(allowances.length);

            allowances.forEach(allowance => {
                const grantee = allowance.grantee;
                console.log(`[INFO] Processing allowance for grantee: ${grantee}`);

                const allowanceData = allowance.allowance;
                const allowanceType = allowanceData['@type'];

                if (allowanceType.includes('AllowedMsgAllowance')) {
                    allowanceData.allowed_messages.forEach(message => {
                        metrics.granteeAllowedMessageGauge.labels(grantee, message).set(1);
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
        periodDurationSeconds = parseInt(allowance.period);
    }

    metrics.granteeTotalLimitGauge.labels(grantee).set(parseInt(spendLimit));
    metrics.granteeTotalExpirationTimestampGauge.labels(grantee).set(totalExpirationTimestamp);
    metrics.granteePeriodLimitGauge.labels(grantee).set(parseInt(periodSpendLimit));
    metrics.granteePeriodSpentGauge.labels(grantee).set(periodSpent);
    metrics.granteePeriodExpirationTimestampGauge.labels(grantee).set(expirationTimestamp);
    metrics.granteePeriodDurationGauge.labels(grantee).set(periodDurationSeconds);
}