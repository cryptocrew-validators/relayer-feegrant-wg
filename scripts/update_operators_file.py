import os
import json

IBC_FOLDER = '../_IBC'
OUTPUT_FILE = '../operators.json'

def extract_operators(file_path, cosmoshub_chain_key):
    """ Extract operators with 'cosmoshub' chain and their addresses from a given JSON file. """
    with open(file_path, 'r') as file:
        data = json.load(file)
        cosmos_operators = []

        for operator in data.get('operators', []):
            if cosmoshub_chain_key in operator:
                cosmos_operator_info = operator[cosmoshub_chain_key]
                if 'address' in cosmos_operator_info:
                    cosmos_operator = {
                        'address': cosmos_operator_info['address'],
                        'memo': operator.get('memo', ''),
                        'name': operator.get('name', ''),
                        'discord': operator.get('discord', {}),
                        'telegram': operator.get('telegram', {})
                    }
                    cosmos_operators.append(cosmos_operator)
                    print(f"Added cosmoshub operator: {cosmos_operator}")

        return cosmos_operators

def main():
    operators = []

    for filename in os.listdir(IBC_FOLDER):
        if filename.endswith('.json'):
            file_path = os.path.join(IBC_FOLDER, filename)
            with open(file_path, 'r') as file:
                data = json.load(file)
                cosmoshub_chain_key = 'chain_1' if data.get('chain_1', {}).get('chain_name', '') == 'cosmoshub' else \
                                      'chain_2' if data.get('chain_2', {}).get('chain_name', '') == 'cosmoshub' else \
                                      None
                if cosmoshub_chain_key:
                    operators.extend(extract_operators(file_path, cosmoshub_chain_key))

    operators.sort(key=lambda op: op.get('name', '').lower())

    with open(OUTPUT_FILE, 'w') as file:
        json.dump({'operators': operators}, file, indent=2)
        print(f"Final operators written to {OUTPUT_FILE}")

if __name__ == '__main__':
    main()