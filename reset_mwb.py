import json
import logging
import subprocess
import sys
import urllib.request
from pathlib import Path

import requests

from mapping_workbench.backend.config import settings

MWB_STAGING_ENV = "staging"
MONGODB_CLEAR_SCRIPT_PATH = Path("./clear_mongodb_mwb_repo.js").resolve()
PREFIXES_JSON_URL = "https://raw.githubusercontent.com/OP-TED/ted-rdf-conversion-pipeline/main/ted_sws/resources/prefixes/prefixes.json"
JSON_PREFIXES_ELEMENTS = "prefix_definitions"
backend_server_api_url = f"{settings.HOST}:{settings.PORT}/api/v1"
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def delete_mwb_db():
    logging.info("Preparing server api url...")
    logging.info("Clearing MWB database...")
    subprocess_result = subprocess.run([f'mongosh {settings.DATABASE_URL}{settings.DATABASE_NAME} --eval "$(cat {MONGODB_CLEAR_SCRIPT_PATH})"'], capture_output = True, text = True, shell=True)
    logging.info(subprocess_result.stdout)
    logging.info(subprocess_result.stderr)
    logging.info("Clearing MWB database done.")

def import_eforms(auth_headers):
    logging.info("Importing eForms from GitHub...")
    import_fields_registry_data = {
        "github_repository_url": "https://github.com/OP-TED/eForms-SDK",
        "branch_or_tag_name": "1.9.1",
        "project_id": "6634a8889e968a96b7c00e81"
    }

    response = requests.post(f"{backend_server_api_url}/fields_registry/tasks/import_eforms_from_github",
                             data=import_fields_registry_data, headers=auth_headers)
    if response.status_code == 201:
        logging.info("Importing eForms from GitHub done.")
    else:
        logging.error("Error importing eForms from GitHub.")
        logging.error(response.text)
        return

def import_namespaces(auth_headers):
    prefixes_json = {}
    with urllib.request.urlopen(PREFIXES_JSON_URL) as url:
        prefixes_json = json.load(url)

    if JSON_PREFIXES_ELEMENTS not in prefixes_json:
        logging.error("Error loading prefixes.")
        return

    prefixes_list = []
    for key, value in prefixes_json[JSON_PREFIXES_ELEMENTS].items():
        prefixes_list.append(
            {
                "is_syncable": False,
                "prefix": key,
                "uri": value
            })

    response = requests.post(f"{backend_server_api_url}/ontology/namespaces/bulk", json=prefixes_list,
                             headers=auth_headers)
    if response.status_code == 201:
        logging.info("Adding prefixes done.")
        logging.info(response.text)
    else:
        logging.error("Error adding prefixes.")
        logging.error(response.text)
        return

def discover_terms(auth_headers):
    logging.info("Discovering terms...")
    response = requests.post(f"{backend_server_api_url}/ontology/tasks/discover_terms", headers=auth_headers)
    if response.status_code == 201:
        logging.info("Discovering terms done.")
    else:
        logging.error("Error discovering terms.")
        logging.error(response.text)
        return

def login_to_mwb() -> str:
    logging.info("Logging to MWB...")
    login_data = {'username': f'{settings.DATABASE_ADMIN_NAME}',
                  'password': f'{settings.DATABASE_ADMIN_PASSWORD}',
                  'remember_me': True}
    response = requests.post(f"{backend_server_api_url}/auth/jwt/login", data=login_data)
    if response.status_code != 200:
        logging.error("Error logging to MWB.")
        logging.error(response.text)
        return
    access_token = json.loads(response.text)['access_token']
    logging.info("Logging to MWB done.")
    auth_headers = {'Authorization': f'Bearer {access_token}'}
    return auth_headers

def reset_mwb():
    if not settings.DEBUG_MODE:
        logging.error("DEBUG_MODE is disabled. Please enable DEBUG_MODE in .env file.")
        return

    if not MONGODB_CLEAR_SCRIPT_PATH.exists():
        logging.error(f"File {MONGODB_CLEAR_SCRIPT_PATH} does not exist.")
        return

    delete_mwb_db()

    auth_headers = login_to_mwb()

    import_eforms(auth_headers)

    discover_terms(auth_headers)

    import_namespaces(auth_headers)

    logging.info("Resetting MWB done. Necessary tasks have been started.")


if __name__ == "__main__":
    reset_mwb()
