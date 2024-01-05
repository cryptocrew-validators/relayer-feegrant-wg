import json
import os
import requests
import time
from datetime import datetime

granter_account = 'cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7'

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
operators_file = os.path.join(base_dir, 'operators.json')

max_retries = 10
retry_delay = 1  # in seconds

def parse_date(date_string):
    try:
        return datetime.fromisoformat(date_string.rstrip('Z'))
    except ValueError:
        print(f"Failed to parse date: {date_string}")
        return None

def fetch_feegrant_info():
    all_allowances = []
    next_key = None

    while True:
        url = f"https://rest.cosmos.directory/cosmoshub/cosmos/feegrant/v1beta1/issued/{granter_account}"
        if next_key:
            url += f"?pagination.key={next_key}"

        retries = 0
        while retries < max_retries:
            print(f"Fetching: {url}, retries: {retries}")
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                all_allowances.extend(data.get('allowances', []))
                next_key = data.get('pagination', {}).get('next_key')
                break
            else:
                retries += 1
                time.sleep(retry_delay)

        if not next_key or retries >= max_retries:
            break

    if retries >= max_retries:
        raise Exception(f"Failed to fetch feegrant info after {max_retries} retries for granter: {granter_account}")

    return all_allowances

def update_feegrant_info(operators_by_path, allowances):
    allowances_by_grantee = {allowance['grantee']: allowance for allowance in allowances}

    for ibc_path, operators in operators_by_path.items():
        for operator in operators:
            operator_address = operator.get('address')
            allowance = allowances_by_grantee.get(operator_address)

            if allowance:
                allowance_details = allowance.get('allowance', {}).get('allowance', {})
                expiration = allowance_details.get('basic', {}).get('expiration')
                expiration_date = parse_date(expiration)
                is_active = expiration_date and expiration_date > datetime.now()

                period_spend_limit = allowance_details.get('period_spend_limit', [])
                spend_limit_amount = sum(int(limit.get('amount', '0')) for limit in period_spend_limit if limit.get('denom') == 'uatom')

                operator['feegrant']['enabled'] = is_active
                operator['feegrant']['expiration'] = expiration if expiration_date else operator['feegrant'].get('expiration')

                if is_active:
                    operator['feegrant']['active_period_spend_limit'] = spend_limit_amount

                print(f"Updated feegrant info for operator {operator.get('name')} on {ibc_path}")
            else:
                print(f"No feegrant info found for operator {operator.get('name')} on {ibc_path}")

def main():
    print("Starting feegrant information update process...")
    if os.path.exists(operators_file):
        print(f"Loading operators from {operators_file}")
        with open(operators_file, 'r') as file:
            operators_by_path = json.load(file)

        allowances = fetch_feegrant_info()
        update_feegrant_info(operators_by_path, allowances)

        print(f"Writing updated operators data to {operators_file}")
        with open(operators_file, 'w') as file:
            json.dump(operators_by_path, file, indent=2)
        print("Update process completed successfully.")
    else:
        print(f"Operators file not found at {operators_file}")

if __name__ == "__main__":
    main()