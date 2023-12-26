import requests
import re
import os
import json

# Constants
REPO_OWNER = 'cosmos'
REPO_NAME = 'chain-registry'
FOLDER_PATH = '_IBC'
FILE_PATTERN = r'.*cosmoshub.*\.json'
GITHUB_API = 'https://api.github.com'
LOCAL_FOLDER = '../_IBC'

def get_files_from_github():
    """
    Fetches the file list from the specified GitHub repository and directory.
    """
    api_url = f'{GITHUB_API}/repos/{REPO_OWNER}/{REPO_NAME}/contents/{FOLDER_PATH}'
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
        if re.match(FILE_PATTERN, file['name']):
            print(f"Processing file: {file['name']}")
            downloaded_content = download_file(file['download_url'])
            if downloaded_content is not None:
                existing_file_path = os.path.join(LOCAL_FOLDER, file['name'])
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
