import dotenv
import json
import os

added_logs = []
removed_logs = []

# Load environment
dotenv.load_dotenv()
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
operators_file_name = os.getenv('OPERATORS_FILE_PATH', 'operators.json')
operators_file = os.path.join(base_dir, operators_file_name)
ibc_folder_name = os.getenv('IBC_FOLDER_PATH', '_IBC')
ibc_folder_path = os.path.join(base_dir, ibc_folder_name)
chain_name = os.getenv('CR_CHAIN_NAME', 'cosmoshub')

def load_existing_operators(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    return []

unique_operators = load_existing_operators(operators_file)
existing_addresses = set(op['address'] for op in unique_operators)
all_operators_in_sources = {}

def get_chain_name_address(operator, ibc_path):
    if ibc_path.startswith(chain_name):
        return operator.get("chain_1", {}).get("address")
    elif ibc_path.endswith(chain_name):
        return operator.get("chain_2", {}).get("address")
    return None

def create_operator_object(new_operator, ibc_path):
    chain_name_address = get_chain_name_address(new_operator, ibc_path)
    return {
        "name": new_operator.get("name", ""),
        "memo": new_operator.get("memo", ""),
        "address": chain_name_address,
        "discord": new_operator.get("discord", {}).get("handle", ""),
        "telegram": new_operator.get("telegram", {}).get("handle", ""),
        "feegrant": new_operator.get("feegrant", {"enabled": False, "period_spend_limit": 0}),
        "paths": [ibc_path]  # Initialize with the current path
    }

def update_or_add_operator(unique_operators, existing_addresses, new_operator, ibc_path):
    if not isinstance(new_operator, dict):
        return  # Skip if new_operator is not a dict

    chain_name_address = get_chain_name_address(new_operator, ibc_path)
    if chain_name_address in existing_addresses:
        # Update paths for existing operator
        for operator in unique_operators:
            if operator['address'] == chain_name_address and ibc_path not in operator['paths']:
                operator['paths'].append(ibc_path)
                added_logs.append(f'Updated paths for {operator["name"]} with address {chain_name_address}')
        return

    # Add new unique operator at the bottom
    operator_object = create_operator_object(new_operator, ibc_path)
    unique_operators.append(operator_object)
    existing_addresses.add(chain_name_address)
    added_logs.append(f'Added {new_operator.get("name")} with address {chain_name_address}')

for filename in os.listdir(ibc_folder_path):
    if filename.endswith('.json'):
        with open(os.path.join(ibc_folder_path, filename), 'r') as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError:
                print(f"JSON decoding failed for file: {filename}")
                continue

            ibc_path = filename.replace('.json', '')
            print(f'Operators in path: {ibc_path}')

            if 'operators' in data and isinstance(data['operators'], list):
                for new_operator in data['operators']:
                    chain_name_address = get_chain_name_address(new_operator, ibc_path)
                    if chain_name_address:
                        all_operators_in_sources[chain_name_address] = all_operators_in_sources.get(chain_name_address, []) + [ibc_path]
                    update_or_add_operator(unique_operators, existing_addresses, new_operator, ibc_path)

# Remove operators that are no longer in any path files and update paths
for operator in unique_operators[:]:
    if operator['address'] not in all_operators_in_sources or not any(path in operator['paths'] for path in all_operators_in_sources[operator['address']]):
        unique_operators.remove(operator)
        removed_logs.append(f"Removed operator with address {operator['address']}")
    else:
        operator['paths'] = [path for path in operator['paths'] if path in all_operators_in_sources[operator['address']]]

# Write to the operators file
with open(operators_file, 'w') as outfile:
    json.dump(unique_operators, outfile, indent=2)

# Print removal & addition logs at the end
print("---------------")
changes_made = False
if added_logs:
    changes_made = True
    for log in added_logs:
        print(log)
if removed_logs:
    changes_made = True
    for log in removed_logs:
        print(log)
if not changes_made:
    print("No changes")
