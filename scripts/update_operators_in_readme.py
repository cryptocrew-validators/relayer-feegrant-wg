import json
import os
import dotenv
import re

# Load environment variables
dotenv.load_dotenv()
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
operators_file_name = os.getenv('OPERATORS_FILE_PATH', 'operators.json')
operators_file = os.path.join(base_dir, operators_file_name)
ibc_folder_name = os.getenv('IBC_FOLDER_PATH', '_IBC')
ibc_folder_path = os.path.join(base_dir, ibc_folder_name)
decimals = int(os.getenv('DECIMALS', 6))
readme_file_path = os.path.join(base_dir, "README.md")

def format_address_link(address, platform):
    if platform.lower() == 'discord':
        return f"[`{address}`](https://discordapp.com/users/{address})"
    elif platform.lower() == 'telegram':
        return f"[`{address}`](https://t.me/{address})"
    return f"`{address}`"

def load_operators():
    with open(operators_file, 'r') as file:
        return json.load(file)

def generate_operators_table(operators):
    table = "| Name | Address | Total Paths | Discord | Telegram | Period Spend Limit | Active Period Spend Limit |\n"
    table += "|------|---------|-------------|---------|----------|--------------------|---------------------------|\n"
    for operator in operators:
        total_paths = len(operator.get('paths', []))
        discord_link = format_address_link(operator.get('discord', ''), 'discord')
        telegram_link = format_address_link(operator.get('telegram', ''), 'telegram')
        period_spend_limit = operator.get('feegrant', {}).get('period_spend_limit', 0) / (10 ** decimals)
        active_period_spend_limit = operator.get('feegrant', {}).get('active_period_spend_limit', 0) / (10 ** decimals)
        address = format_address_link(operator.get('address', ''), '')
        table += f"| {operator.get('name')} | {address} | {total_paths} | {discord_link} | {telegram_link} | {period_spend_limit} | {active_period_spend_limit} |\n"
    return table

def update_readme(new_content):
    with open(readme_file_path, 'r') as file:
        readme_lines = file.readlines()

    found_operators = False
    updated_lines = []

    for line in readme_lines:
        if line.startswith("## Operators"):
            if not found_operators:
                found_operators = True
                updated_lines.append(line) 
        elif found_operators:
            continue
        else:
            updated_lines.append(line)

    updated_content = ''.join(updated_lines)

    with open(readme_file_path, 'w', encoding='utf-8') as readme_file:
        readme_file.write(updated_content + new_content)

def main():
    operators = load_operators()
    operators_table = generate_operators_table(operators)
    new_content = "\n## Operators" + operators_table + "\n"
    
    new_content += "## Paths\n"
    
    ibc_paths_data = {}
    for filename in os.listdir(ibc_folder_path):
        if filename.endswith('.json'):
            ibc_path = filename.replace('.json', '')
            with open(os.path.join(ibc_folder_path, filename), 'r') as file:
                ibc_paths_data[ibc_path] = json.load(file).get('operators', [])
    
    # Sort paths alphabetically
    sorted_paths = sorted(ibc_paths_data.keys())
    
    for ibc_path in sorted_paths:
        operators = ibc_paths_data[ibc_path]
        if not operators:
            continue 
        new_content += f"\n<details><summary>{ibc_path}</summary>\n\n"
        new_content += "| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |\n"
        new_content += "|------|-----------------|-----------------|--------------------|---------------------------|\n"
        for operator in operators:
            operator_data = next((op for op in operators if op.get('address') == operator.get('address')), {})
            chain_1_address = format_address_link(operator.get('chain_1', {}).get('address', ''), '')
            chain_2_address = format_address_link(operator.get('chain_2', {}).get('address', ''), '')
            period_spend_limit = operator_data.get('feegrant', {}).get('period_spend_limit', 0) / (10 ** decimals)
            active_period_spend_limit = operator_data.get('feegrant', {}).get('active_period_spend_limit', 0) / (10 ** decimals)
            new_content += f"| {operator.get('name')} | {chain_1_address} | {chain_2_address} | {period_spend_limit} | {active_period_spend_limit} |\n"
        new_content += "</details>\n"

    update_readme(new_content)

if __name__ == "__main__":
    main()