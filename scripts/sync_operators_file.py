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

def load_existing_operators(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return {}
    return {}

operators_by_path = load_existing_operators(operators_file)
all_operators_in_sources = set()

def get_cosmoshub_address(operator, ibc_path):
    if ibc_path.startswith("cosmoshub-"):
        return operator.get("chain_1", {}).get("address")
    elif ibc_path.endswith("-cosmoshub"):
        return operator.get("chain_2", {}).get("address")
    return None

def create_operator_object(new_operator, ibc_path):
    cosmoshub_address = get_cosmoshub_address(new_operator, ibc_path)
    return {
        "name": new_operator.get("name", ""),
        "memo": new_operator.get("memo", ""),
        "address": cosmoshub_address,
        "discord": new_operator.get("discord", {}).get("handle", ""),
        "telegram": new_operator.get("telegram", {}).get("handle", ""),
        "feegrant": new_operator.get("feegrant", {"enabled": False, "period_spend_limit": 0})
    }

def update_or_add_operator(operators_by_path, new_operator, ibc_path):
    if not isinstance(new_operator, dict):
        return  # Skip if new_operator is not a dict

    cosmoshub_address = get_cosmoshub_address(new_operator, ibc_path)
    unique_key = (ibc_path, cosmoshub_address)
    all_operators_in_sources.add(unique_key)

    # Check if an operator with the same unique key already exists
    existing_operators = operators_by_path.get(ibc_path, [])
    for operator in existing_operators:
        if operator.get("address") == cosmoshub_address:
            print(f'Skipping {new_operator.get("name")}. Address already set for {ibc_path} operator: {operator.get("name")}')
            return

    # No existing operator with the same address found in this path, add new operator
    operator_object = create_operator_object(new_operator, ibc_path)
    operators_by_path.setdefault(ibc_path, []).append(operator_object)
    added_logs.append(f'Added {new_operator.get("name")} for {ibc_path}')


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
                    if isinstance(new_operator, dict):
                        update_or_add_operator(operators_by_path, new_operator, ibc_path)
                    else:
                        print(f'Invalid operator format in {filename}: {new_operator}')

# Clear operators that are no longer in source files
for ibc_path, operators in list(operators_by_path.items()):
    original_operators = operators.copy()
    operators_by_path[ibc_path] = [op for op in operators if (ibc_path, op.get('address')) in all_operators_in_sources]
    removed_operators = [op for op in original_operators if (ibc_path, op.get('address')) not in all_operators_in_sources]

    if removed_operators:
        removed_logs.append(f"Removed from {ibc_path}: {[op['name'] for op in removed_operators]}")

# Write to the operators file
with open(operators_file, 'w') as outfile:
    json.dump(operators_by_path, outfile, indent=2)

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
