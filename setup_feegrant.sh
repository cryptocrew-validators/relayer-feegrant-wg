GRANTER="controller" # local granter key-name
LEDGER="true"
KEYRING_BACKEND="os" # os, file, test
KEYRING_DIR="$HOME/.gaia-mainnet"

GRANTEES="cosmos1f269n4mrg0s8tqveny9huulyamvdv97n094dgm" # comma-seperated list of grantee-addresses
EXPIRATION="2023-12-30T12:00:00Z" # empty to use no expiration date / RFC 3339 timestamp after which the grant expires for the grantee
SPEND_LIMIT="" # empty to use no limit / cosmos-sdk coin to limit total grant amount per grantee

# use to define period spend limits
PERIOD="86400"  # empty to use no period / specifies the time duration for a spend period (in secs / 1 day = 86400)
PERIOD_LIMIT="10000000uatom" # empty to use no period limit / cosmos-sdk coin to limit period amount per grantee

DAEMON_NAME="gaiad"
DAEMON_HOME="$HOME/.gaia-mainnet"
CHAIN_ID="cosmoshub-4"
RPC="https://rpc.cosmos.directory:443/cosmoshub"
GAS_PRICES="0.025uatom"

# don't change to setup grant for standard IBC relayer msg types / comma-seperated list of fully-qualified protobuf msg types
ALLOWED_MESSAGES="/ibc.core.client.v1.MsgCreateClient,/ibc.core.client.v1.MsgUpdateClient,/ibc.core.client.v1.MsgUpgradeClient,/ibc.core.client.v1.MsgSubmitMisbehaviour,/ibc.core.client.v1.MsgRecoverClient,/ibc.core.client.v1.MsgIBCSoftwareUpgrade,/ibc.core.client.v1.MsgUpdateClientParams,/ibc.core.connection.v1.MsgConnectionOpenInit,/ibc.core.connection.v1.MsgConnectionOpenTry,/ibc.core.connection.v1.MsgConnectionOpenAck,/ibc.core.connection.v1.MsgConnectionOpenConfirm,/ibc.core.connection.v1.MsgUpdateConnectionParams,/ibc.core.channel.v1.MsgChannelOpenInit,/ibc.core.channel.v1.MsgChannelOpenTry,/ibc.core.channel.v1.MsgChannelOpenAck,/ibc.core.channel.v1.MsgChannelOpenConfirm,/ibc.core.channel.v1.MsgChannelCloseInit,/ibc.core.channel.v1.MsgChannelCloseConfirm,/ibc.core.channel.v1.MsgRecvPacket,/ibc.core.channel.v1.MsgTimeout,/ibc.core.channel.v1.MsgTimeoutOnClose,/ibc.core.channel.v1.MsgAcknowledgement,/ibc.applications.transfer.v1.MsgTransfer,/ibc.applications.transfer.v1.MsgUpdateParams"

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

# to revoke: $DAEMON_NAME tx feegrant revoke $GRANTER $grantee $flags