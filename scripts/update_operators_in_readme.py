import dotenv
import json
import os

# Load environment variables
dotenv.load_dotenv()
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
operators_file_name = os.getenv('OPERATORS_FILE_PATH', 'operators.json')
operators_file = os.path.join(base_dir, operators_file_name)
ibc_folder_name = os.getenv('IBC_FOLDER_PATH', '_IBC')
ibc_folder_path = os.path.join(base_dir, ibc_folder_name)
decimals = int(os.getenv('DECIMALS', 6))

def format_address_link(address, platform):
    if platform.lower() == 'discord':
        return f"[{address}](https://discordapp.com/users/{address})"
    elif platform.lower() == 'telegram':
        return f"[{address}](https://t.me/{address})"
    return address

def load_operators():
    with open(operators_file, 'r') as file:
        return json.load(file)

def generate_operators_table(operators):
    table = "| Name | Address | Total Paths | Contact | Period Spend Limit | Active Period Spend Limit |\n"
    table += "|------|---------|-------------|---------|--------------------|---------------------------|\n"
    for operator in operators:
        total_paths = len(operator.get('paths', []))
        discord_link = format_address_link(operator.get('discord', ''), 'discord')
        telegram_link = format_address_link(operator.get('telegram', ''), 'telegram')
        contact = f"Discord: {discord_link}, Telegram: {telegram_link}"
        period_spend_limit = operator.get('feegrant', {}).get('period_spend_limit', 0) / (10 ** decimals)
        active_period_spend_limit = operator.get('feegrant', {}).get('active_period_spend_limit', 0) / (10 ** decimals)
        address = operator.get('address', '')
        table += f"| {operator.get('name')} | {address} | {total_paths} | {contact} | {period_spend_limit} | {active_period_spend_limit} |\n"
    return table

def append_to_readme(content):
    with open("README.md", "a") as readme_file:
        readme_file.write(content)

def main():
    operators = load_operators()
    operators_table = generate_operators_table(operators)
    
    append_to_readme("\n## Operators Overview\n")
    append_to_readme(operators_table)

    ibc_paths_data = {}
    for filename in os.listdir(ibc_folder_path):
        if filename.endswith('.json'):
            ibc_path = filename.replace('.json', '')
            with open(os.path.join(ibc_folder_path, filename), 'r') as file:
                ibc_paths_data[ibc_path] = json.load(file).get('operators', [])

    for ibc_path, operators in ibc_paths_data.items():
        append_to_readme(f"\n<details><summary>{ibc_path} Operators</summary>\n\n")
        append_to_readme("| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |\n")
        append_to_readme("|------|-----------------|-----------------|--------------------|---------------------------|\n")
        for operator in operators:
            operator_data = next((op for op in operators if op.get('address') == operator.get('address')), {})
            chain_1_address = operator.get('chain_1', {}).get('address', '')
            chain_2_address = operator.get('chain_2', {}).get('address', '')
            period_spend_limit = operator_data.get('feegrant', {}).get('period_spend_limit', 0) / (10 ** decimals)
            active_period_spend_limit = operator_data.get('feegrant', {}).get('active_period_spend_limit', 0) / (10 ** decimals)
            append_to_readme(f"| {operator.get('name')} | {chain_1_address} | {chain_2_address} | {period_spend_limit} | {active_period_spend_limit} |\n")
        append_to_readme("</details>\n")

if __name__ == "__main__":
    main()
