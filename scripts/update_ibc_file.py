import os
import json
import sys
import requests

def get_issue_content(issue_number, token):
    """Fetch the content of the issue from GitHub."""
    url = f"https://api.github.com/repos/{os.environ['GITHUB_REPOSITORY']}/issues/{issue_number}"
    headers = {"Authorization": f"token {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch issue content: {response.status_code}")

def parse_issue_content(issue_content):
    """Parse the issue content to extract necessary information."""
    body = issue_content['body']
    lines = body.split('\n')
    data = {}
    for line in lines:
        if line.startswith('- '):
            key, value = line[2:].split(':', 1)
            data[key.strip()] = value.strip()
    return data

def update_ibc_file(ibc_path, operator_data):
    """Update the respective JSON file in the _IBC folder."""
    file_path = f'./_IBC/{ibc_path}.json'
    with open(file_path, 'r') as file:
        data = json.load(file)
    
    # Determine which chain is 'cosmoshub'
    cosmoshub_chain_key = 'chain_1' if data.get('chain_1', {}).get('chain_name', '') == 'cosmoshub' else \
                          'chain_2' if data.get('chain_2', {}).get('chain_name', '') == 'cosmoshub' else \
                          None

    if cosmoshub_chain_key:
        new_operator = {
            cosmoshub_chain_key: {
                "address": operator_data['Cosmoshub Account']
            },
            'memo': operator_data.get('Memo', ''),
            'name': operator_data.get('Operator Name', ''),
            'discord': {'handle': operator_data.get('Discord Handle', '')},
            'telegram': {'handle': operator_data.get('Telegram Handle', '')}
        }
        data['operators'].append(new_operator)
    else:
        print(f"Cosmoshub chain not found in {ibc_path}.json")

    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def main():
    issue_number = sys.argv[1]
    token = os.environ['GITHUB_TOKEN']
    issue_content = get_issue_content(issue_number, token)
    operator_data = parse_issue_content(issue_content)
    ibc_path = operator_data.pop('IBC Path')
    update_ibc_file(ibc_path, operator_data)
    print(f"Updated {ibc_path}.json with new operator data.")

if __name__ == "__main__":
    main()
