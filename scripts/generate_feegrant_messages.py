import json
import os
import requests
import subprocess
from datetime import datetime

# Setup constants
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
operators_file = os.path.join(base_dir, 'operators.json')

# Gaia-related constants
granter_account = 'cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7'
daemon_name = "gaiad"
daemon_home = "$HOME/.gaia"
chain_id = "cosmoshub-4"
gas_prices = "0.005uatom"
allowed_messages = "/ibc.core.client.v1.MsgCreateClient,/ibc.core.client.v1.MsgUpdateClient,/ibc.core.client.v1.MsgUpgradeClient,/ibc.core.client.v1.MsgSubmitMisbehaviour,/ibc.core.client.v1.MsgRecoverClient,/ibc.core.client.v1.MsgIBCSoftwareUpgrade,/ibc.core.client.v1.MsgUpdateClientParams,/ibc.core.connection.v1.MsgConnectionOpenInit,/ibc.core.connection.v1.MsgConnectionOpenTry,/ibc.core.connection.v1.MsgConnectionOpenAck,/ibc.core.connection.v1.MsgConnectionOpenConfirm,/ibc.core.connection.v1.MsgUpdateConnectionParams,/ibc.core.channel.v1.MsgChannelOpenInit,/ibc.core.channel.v1.MsgChannelOpenTry,/ibc.core.channel.v1.MsgChannelOpenAck,/ibc.core.channel.v1.MsgChannelOpenConfirm,/ibc.core.channel.v1.MsgChannelCloseInit,/ibc.core.channel.v1.MsgChannelCloseConfirm,/ibc.core.channel.v1.MsgRecvPacket,/ibc.core.channel.v1.MsgTimeout,/ibc.core.channel.v1.MsgTimeoutOnClose,/ibc.core.channel.v1.MsgAcknowledgement,/ibc.applications.transfer.v1.MsgTransfer,/ibc.applications.transfer.v1.MsgUpdateParams"
rpc = "https://cosmos-rpc.publicnode.com:443"
period_duration = "86400"

def fetch_account_data(granter_account):
    url = f"https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts/{granter_account}"
    response = requests.get(url)
    if response.status_code == 200:
        account_data = response.json().get('account', {})
        return account_data.get('account_number'), account_data.get('sequence')
    else:
        raise Exception(f"Failed to fetch account data for {granter_account}")

def generate_feegrant_command(granter, grantee, expiration, period, period_limit, flags):
    print(f"Debug period: {period} period limit {period_limit}")
    command = f"{daemon_name} tx feegrant grant {granter} {grantee} "
    if expiration:
        command += f"--expiration '{expiration}' "
    if period and period_limit:
        command += f"--period {period} --period-limit '{period_limit}uatom' "
    return command + flags

def is_expiration_past(expiration):
    if not expiration:
        return True  # Treat undefined expiration as past
    expiration_date = datetime.fromisoformat(expiration.rstrip("Z"))
    return expiration_date < datetime.now()

def main():
    account_number, sequence = fetch_account_data(granter_account)
    sequence = int(sequence)
    sequence += 1  # Increment the sequence, but consider if this is needed at the start

    with open(operators_file, 'r') as file:
        operators_by_path = json.load(file)

    feegrant_messages = []

    for ibc_path, operators in operators_by_path.items():
        for operator in operators:
            print(f"Debug: running operator: {operator}")
            feegrant = operator.get('feegrant', {})
            expiration = feegrant.get('expiration')
            active_period_limit = feegrant.get('active_period_spend_limit')
            current_period_limit = feegrant.get('period_spend_limit')

            update_needed = feegrant.get('enabled') and (is_expiration_past(expiration) or active_period_limit != current_period_limit)

            if update_needed:
                flags = f"--home '{daemon_home}' --from '{granter_account}' --allowed-messages '{allowed_messages}' --chain-id '{chain_id}' --gas 200000 --gas-prices '{gas_prices}' --node '{rpc}' --offline --output json --yes --generate-only --sequence {sequence} --account-number {account_number}"
                command = generate_feegrant_command(granter_account, operator['address'], expiration, period_duration, current_period_limit, flags)
                print(f"Running command: {command}")

                try:
                    result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                    command_output = json.loads(result.stdout.strip())
                    messages = command_output.get("body", {}).get("messages", [])
                    feegrant_messages.extend(messages)  # Append all messages
                except subprocess.CalledProcessError as e:
                    print(f"Error running command: {e.stderr}")
                    continue
                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON from command output: {e.msg}")
                    continue

    print("Generated Feegrant Messages:")
    print(json.dumps(feegrant_messages, indent=2))

if __name__ == "__main__":
    main()