#!/usr/bin/env bash

# We're heavily relying on contributions by Archway here: https://github.com/archway-network/networks

set -euo pipefail

DATA=$(jq . $1)
RLY_HOME=$(mktemp -d)

cleanup() {
    rm -rf "$RLY_HOME"
}

trap cleanup EXIT

get_chains() {
    jq -r '.chain_1.chain_name + " " + .chain_2.chain_name' <<< $DATA
}

get_clients() {
    jq -r '.chain_1.client_id + " " + .chain_2.client_id' <<< $DATA
}

is_client_valid() {
    local chain=$1
    local client_id=$2

    state=$(rly query client $chain $client_id --home "$RLY_HOME" | jq)
    trusting_period=$(jq -r '.client_state.trusting_period | .[:-1]' <<< $state)
    unbonding_period=$(jq -r '.client_state.unbonding_period | .[:-1]' <<< $state)

    # Print the trusting and unbonding periods for debugging or logging
    echo $trusting_period $unbonding_period \
        | awk '{printf "trusting_period: %ss, required_trusting_period_min: %ss, required_trusting_period_max: %ss, unbonding_period: %ss\n", $1, (0.60 * $2), (0.85 * $2), $2;}' >&2

    # Check if the trusting period is between 60% and 85% of the unbonding period
    echo $trusting_period $unbonding_period \
        | awk '{if ($1 >= 0.60 * $2 && $1 <= 0.85 * $2) print "yes"; else print "no"}'
}

echo "Checking $1" >&2

rly config init --home "$RLY_HOME"

chains=($(get_chains))
clients=($(get_clients))

for chain in "${chains[@]}"; do
    if [[ "${chain: -7}" == "testnet" ]]; then
        rly chains add $chain --testnet --home "$RLY_HOME"
    else
        rly chains add $chain --home "$RLY_HOME"
    fi
done

invalid=()
for index in "${!chains[@]}"; do
    echo "Checking client ${clients[$index]} on chain ${chains[$index]}" >&2
    valid="$(is_client_valid ${chains[$index]} ${clients[$index]})"

    if [[ $valid == "no" ]]; then
        invalid+=("${clients[$index]}")
    fi
done

if [[ "${#invalid[@]}" -gt 0 ]]; then
    echo "Error: Incorrect trusting period for all or some clients" >&2
    echo "Done" >&2
    exit 1
fi

echo "Done" >&2
