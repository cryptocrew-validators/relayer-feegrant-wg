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
daemon_home = "../utils/.gaia"
chain_id = "cosmoshub-4"
gas_prices = "0.005uatom"
allowed_messages = "/ibc.core.client.v1.MsgCreateClient,/ibc.core.client.v1.MsgUpdateClient,/ibc.core.client.v1.MsgUpgradeClient,/ibc.core.client.v1.MsgSubmitMisbehaviour,/ibc.core.client.v1.MsgRecoverClient,/ibc.core.client.v1.MsgIBCSoftwareUpgrade,/ibc.core.client.v1.MsgUpdateClientParams,/ibc.core.connection.v1.MsgConnectionOpenInit,/ibc.core.connection.v1.MsgConnectionOpenTry,/ibc.core.connection.v1.MsgConnectionOpenAck,/ibc.core.connection.v1.MsgConnectionOpenConfirm,/ibc.core.connection.v1.MsgUpdateConnectionParams,/ibc.core.channel.v1.MsgChannelOpenInit,/ibc.core.channel.v1.MsgChannelOpenTry,/ibc.core.channel.v1.MsgChannelOpenAck,/ibc.core.channel.v1.MsgChannelOpenConfirm,/ibc.core.channel.v1.MsgChannelCloseInit,/ibc.core.channel.v1.MsgChannelCloseConfirm,/ibc.core.channel.v1.MsgRecvPacket,/ibc.core.channel.v1.MsgTimeout,/ibc.core.channel.v1.MsgTimeoutOnClose,/ibc.core.channel.v1.MsgAcknowledgement,/ibc.applications.transfer.v1.MsgTransfer,/ibc.applications.transfer.v1.MsgUpdateParams"
rpc = "https://rpc.cosmos.directory:443/cosmoshub"
period_duration = "86400"

def fetch_account_data(granter_account):
    url = f"https://rest.cosmos.directory/cosmoshub/cosmos/auth/v1beta1/accounts/{granter_account}"
    response = requests.get(url)
    if response.status_code == 200:
        account_data = response.json().get('account', {})
        return account_data.get('account_number'), account_data.get('sequence')
    else:
        raise Exception(f"Failed to fetch account data for {granter_account}")

def generate_feegrant_command(granter, grantee, expiration, period, period_limit, flags, revoke=False):
    if revoke:
        return f"{daemon_name} tx feegrant revoke {granter} {grantee} {flags}"
    else:
        command = f"{daemon_name} tx feegrant grant {granter} {grantee} "
        if expiration:
            command += f"--expiration '{expiration}' "
        if period and period_limit:
            command += f"--period {period} --period-limit '{period_limit}uatom' "
        return command + flags

def is_expiration_past(expiration):
    if not expiration:
        return False
    expiration_date = datetime.fromisoformat(expiration.rstrip("Z"))
    return expiration_date < datetime.now()

def main():
    account_number, sequence = fetch_account_data(granter_account)
    sequence = int(sequence)
    sequence += 1
    all_messages = []
    final_tx = None
    global last_tx_fields
    last_tx_fields = None 

    with open(operators_file, 'r') as file:
        operators_by_path = json.load(file)

    for ibc_path, operators in operators_by_path.items():
        for operator in operators:
            feegrant = operator.get('feegrant', {})
            expiration = feegrant.get('expiration')
            active_period_limit = feegrant.get('active_period_spend_limit')
            current_period_limit = feegrant.get('period_spend_limit')
            enabled = feegrant.get('enabled')

            grant_needed = enabled and current_period_limit > 0 and active_period_limit != current_period_limit
            renew_needed = enabled and (is_expiration_past(expiration) or current_period_limit != active_period_limit)
            revoke_needed = not enabled or current_period_limit == 0 or renew_needed

            if grant_needed or renew_needed or revoke_needed:
                update_actions = []
                if grant_needed:
                    update_actions.append("grant needed")
                if renew_needed:
                    update_actions.append("renew needed")
                if revoke_needed:
                    update_actions.append("revoke needed")

                print(f"Update needed for operator {operator['name']} with address {operator['address']}: {', '.join(update_actions)}")
                if grant_needed or renew_needed:
                    print(f"  - Current period limit: {current_period_limit}")
                    print(f"  - Active period limit: {active_period_limit}")
                    print(f"  - Expiration: {expiration}")
                if revoke_needed:
                    print(f"  - Revocation due to either disabled status or renewal requirement.")

                total_gas_limit = 80000 + 40000 * (len(all_messages) + 1)
                flags = f"--home '{daemon_home}' --from '{granter_account}' --chain-id '{chain_id}' --gas {total_gas_limit} --gas-prices '{gas_prices}' --node '{rpc}' --offline --output json --yes --generate-only --sequence {sequence} --account-number {account_number}"

                if renew_needed or revoke_needed:
                    revoke_command = generate_feegrant_command(granter_account, operator['address'], None, None, None, flags, revoke=True)
                    run_subprocess_command(revoke_command, all_messages)

                if renew_needed or grant_needed:
                    command = generate_feegrant_command(granter_account, operator['address'], expiration, "86400", current_period_limit, flags)
                    run_subprocess_command(command, all_messages)
            else:
                print(f"No Update needed for operator {operator['name']} with address {operator['address']}")

    # Construct final transaction if there are messages to include
    if all_messages:
        final_tx = {
            "body": {
                "messages": all_messages,
                **last_tx_fields['body']
            },
            "auth_info": last_tx_fields['auth_info'],
            "signatures": last_tx_fields['signatures']
        }

    # Output the final transaction
    if final_tx:
        print("Batched tx messages:")
        print(json.dumps(final_tx, indent=2))
    else:
        print("No final transaction generated.")

def run_subprocess_command(command, all_messages):
    global last_tx_fields
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        command_output = json.loads(result.stdout.strip())
        messages = command_output.get("body", {}).get("messages", [])
        all_messages.extend(messages)

        # Save the last transaction fields, excluding the messages
        if 'body' in command_output:
            last_tx_fields = command_output
            last_tx_fields['body'].pop('messages', None)

    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e.stderr}")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from command output: {e.msg}")

if __name__ == "__main__":
    main()