import dotenv
import requests
import re
import os
import json

# Load environment
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv.load_dotenv()

chain_name = os.getenv('CR_CHAIN_NAME', 'cosmoshub')
cr_repo_owner = os.getenv('CR_REPO_OWNER', 'cosmos')
cr_repo_name = os.getenv('CR_REPO_NAME', 'chain-registry')
cr_folder_path = os.getenv('CR_FOLDER_PATH', '_IBC')
ibc_folder_name = os.getenv('IBC_FOLDER_PATH', '_IBC')
ibc_folder_path = os.path.join(base_dir, ibc_folder_name)

file_pattern = rf'.*{chain_name}.*\.json'
github_api_url = 'https://api.github.com'

def get_files_from_github():
    """
    Fetches the file list from the specified GitHub repository and directory.
    """
    api_url = f'{github_api_url}/repos/{cr_repo_owner}/{cr_repo_name}/contents/{cr_folder_path}'
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f'Failed to fetch files: {response.status_code}')
        return []

def download_file(file_url):
    """
    Downloads file content from the given URL.
    """
    response = requests.get(file_url)
    if response.status_code == 200:
        return response.text
    else:
        print(f'Failed to download file: {response.status_code}')
        return None

def custom_format_json(obj):
    """
    Custom function to format a JSON object.
    """
    if isinstance(obj, dict):
        formatted_obj = {k: custom_format_json(v) for k, v in sorted(obj.items())}
    elif isinstance(obj, list):
        formatted_obj = [custom_format_json(item) for item in obj]
    else:
        formatted_obj = obj
    return formatted_obj

def merge_files(downloaded_content, existing_content):
    """
    Merges downloaded file content with existing file content.
    Applies custom formatting to the merged JSON.
    """
    downloaded_data = json.loads(downloaded_content)
    existing_data = json.loads(existing_content)
    merged_data = {**existing_data, **downloaded_data}
    formatted_data = custom_format_json(merged_data)
    return json.dumps(merged_data, indent=2, sort_keys=False)

def main():
    files = get_files_from_github()
    for file in files:
        if re.match(file_pattern, file['name']):
            print(f"Processing file: {file['name']}")
            downloaded_content = download_file(file['download_url'])
            if downloaded_content is not None:
                existing_file_path = os.path.join(ibc_folder_path, file['name'])
                if os.path.exists(existing_file_path):
                    with open(existing_file_path, 'r') as existing_file:
                        existing_content = existing_file.read()
                    merged_content = merge_files(downloaded_content, existing_content)
                    with open(existing_file_path, 'w') as existing_file:
                        existing_file.write(merged_content)
                else:
                    with open(existing_file_path, 'w') as new_file:
                        new_file.write(downloaded_content)

if __name__ == "__main__":
    main()
