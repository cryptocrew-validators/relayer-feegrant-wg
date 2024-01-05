import json
import os

# Define the base directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_existing_operators(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return {}
    return {}

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

    # Check if an operator with the same cosmoshub address already exists
    for operator in operators_by_path.get(ibc_path, []):
        if operator.get("address") == cosmoshub_address:
            return  # Skip if cosmoshub address is already used by another operator

    # Create and add new operator object with ordered properties
    operator_object = create_operator_object(new_operator, ibc_path)
    operators_by_path.setdefault(ibc_path, []).append(operator_object)

operators_file = os.path.join(base_dir, 'operators.json')
operators_by_path = load_existing_operators(operators_file)

ibc_dir = os.path.join(base_dir, '_IBC')
for filename in os.listdir(ibc_dir):
    if filename.endswith('.json'):
        with open(os.path.join(ibc_dir, filename), 'r') as file:
            try:
                data = json.load(file)
            except json.JSONDecodeError:
                continue

            ibc_path = filename.replace('.json', '')

            if 'operators' in data and isinstance(data['operators'], list):
                for new_operator in data['operators']:
                    if isinstance(new_operator, dict):
                        update_or_add_operator(operators_by_path, new_operator, ibc_path)

# Write to the operators file
with open(operators_file, 'w') as outfile:
    json.dump(operators_by_path, outfile, indent=2)
