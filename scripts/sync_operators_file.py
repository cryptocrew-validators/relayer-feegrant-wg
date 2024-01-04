import json
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_existing_operators(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            return json.load(file)
    return []

def update_or_add_operator(existing_operators, new_operator, ibc_path):
    for operator in existing_operators:
        if operator['ibc_path'] == ibc_path and operator['name'] == new_operator['name']:
            # Update existing operator without overriding feegrant
            if 'feegrant' not in new_operator:
                new_operator['feegrant'] = operator.get('feegrant', {
                    'enabled': True,
                    'period_spend_limit': 0  # Default value
                })
            return False
    return True

operators_file = os.path.join(base_dir, 'operators.json')
existing_operators = load_existing_operators(operators_file)

ibc_dir = os.path.join(base_dir, '_IBC')
for filename in os.listdir(ibc_dir):
    if filename.endswith('.json'):
        with open(os.path.join(ibc_dir, filename), 'r') as file:
            data = json.load(file)
            ibc_path = filename.replace('.json', '')

            if 'operators' in data:
                for new_operator in data['operators']:
                    new_operator['ibc_path'] = ibc_path
                    # Update or add the new operator
                    if update_or_add_operator(existing_operators, new_operator, ibc_path):
                        existing_operators.append(new_operator)

# Write to the operators file
with open(operators_file, 'w') as outfile:
    json.dump(existing_operators, outfile, indent=4)
