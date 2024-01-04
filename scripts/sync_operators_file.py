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

def update_or_add_operator(operators_by_path, new_operator, ibc_path):
    if not isinstance(new_operator, dict):
        return  # Skip if new_operator is not a dict

    for operator in operators_by_path.get(ibc_path, []):
        if isinstance(operator, dict) and operator.get('name') == new_operator.get('name'):
            # Update existing operator without overriding feegrant
            if 'feegrant' not in new_operator and 'feegrant' in operator:
                new_operator['feegrant'] = operator['feegrant']
            return
    # Add new operator if not found
    operators_by_path.setdefault(ibc_path, []).append(new_operator)

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
