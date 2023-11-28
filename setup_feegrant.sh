GRANTER="controller" # local granter key-name
LEDGER="true"
KEYRING_BACKEND="os" # os, file, test
KEYRING_DIR="$HOME/.gaia-testnet"

GRANTEES="cosmos1yvejj22t78s2vfk7slty2d7fs5lkc8rnnt3j9u" # comma-seperated list of grantee-addresses
EXPIRATION="2023-12-30T12:00:00Z" # empty to use no expiration date / RFC 3339 timestamp after which the grant expires for the grantee
SPEND_LIMIT="10000000uatom" # empty to use no limit / cosmos-sdk coin to limit total grant amount per grantee

# use to define period spend limits
PERIOD="86400"  # empty to use no period / specifies the time duration for a spend period (in secs / 1 day = 86400)
PERIOD_LIMIT="1000000uatom" # empty to use no period limit / cosmos-sdk coin to limit period amount per grantee

DAEMON_NAME="gaiad"
DAEMON_HOME="$HOME/.gaia-testnet"
CHAIN_ID="theta-testnet-001"
RPC="https://rpc.sentry-01.theta-testnet.polypore.xyz:443"
GAS_PRICES="0.005uatom"

# don't change to setup grant for standard IBC relayer msg types / comma-seperated list of fully-qualified protobuf msg types
ALLOWED_MESSAGES="/ibc.core.client.v1.MsgUpdateClient,/ibc.core.channel.v1.MsgAcknowledgement,/ibc.core.channel.v1.MsgRecvPacket,/ibc.core.channel.v1.MsgTimeout"

flags='--home '$DAEMON_HOME' --from '$GRANTER' --chain-id '$CHAIN_ID' --node '$RPC' --gas auto --gas-adjustment 1.5 --gas-prices '$GAS_PRICES' -y'
if [[ "$LEDGER" == "true" ]] ; then
    flags=$flags' --ledger'
fi
if [[ ! -z "$EXPIRATION" ]] ; then
    flags=$flags' --expiration '$EXPIRATION
fi
if [[ ! -z "$SPEND_LIMIT" ]] ; then
    flags=$flags' --spend-limit '$SPEND_LIMIT
fi
if [[ ! -z "$ALLOWED_MESSAGES" ]] ; then
    flags=$flags' --allowed-messages "'$ALLOWED_MESSAGES'"'
fi
if [[ ! -z "$PERIOD" ]] && [[ ! -z "$PERIOD_LIMIT" ]] ; then
    flags=$flags' --period '$PERIOD' --period-limit '$PERIOD_LIMIT
fi

IFS=':' read -ra arr <<< $GRANTEES
for grantee in ${arr[@]}; do
echo "$DAEMON_NAME tx feegrant grant $GRANTER $grantee $flags"
    $DAEMON_NAME tx feegrant grant $GRANTER $grantee $flags
    sleep 7
done