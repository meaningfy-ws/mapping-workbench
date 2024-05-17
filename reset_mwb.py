import json
import logging
import subprocess
import sys
import urllib.request

import requests

from mapping_workbench.backend.config import settings

MWB_STAGING_ENV = "staging"
PREFIXES_JSON_URL = "https://raw.githubusercontent.com/OP-TED/ted-rdf-conversion-pipeline/main/ted_sws/resources/prefixes/prefixes.json"
JSON_PREFIXES_ELEMENTS = "prefix_definitions"
backend_server_api_url = f"{settings.HOST}:{settings.PORT}/api/v1"
logging.basicConfig(stream=sys.stdout, level=logging.INFO)


def delete_mwb_db():
    logging.info("Preparing server api url...")
    logging.info("Clearing MWB database...")
    back_slash = "\\"
    subprocess_result = subprocess.run(
        [f'mongosh {settings.DATABASE_URL}{settings.DATABASE_NAME} --eval "{settings.MW_RESET_MONGODB_QUERY.replace("$", f"{back_slash}$") }"'],
        capture_output=True, text=True, shell=True)
    logging.info(subprocess_result.stdout)
    if subprocess_result.returncode != 0:
        raise Exception("Error clearing MWB database.", subprocess_result.stderr)
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
        raise Exception("Error importing eForms from GitHub.", response.text)


def import_namespaces(auth_headers):
    prefixes_json = {}
    with urllib.request.urlopen(PREFIXES_JSON_URL) as url:
        prefixes_json = json.load(url)

    if JSON_PREFIXES_ELEMENTS not in prefixes_json:
        raise Exception("Error loading prefixes.")

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
        raise Exception("Error adding prefixes.", response.text)



def discover_terms(auth_headers):
    logging.info("Discovering terms...")
    response = requests.post(f"{backend_server_api_url}/ontology/tasks/discover_terms", headers=auth_headers)
    if response.status_code == 201:
        logging.info("Discovering terms done.")
    else:
        raise Exception("Error discovering terms.", response.text)


def login_to_mwb() -> dict:
    logging.info("Logging to MWB...")
    login_data = {'username': f'{settings.DATABASE_ADMIN_NAME}',
                  'password': f'{settings.DATABASE_ADMIN_PASSWORD}',
                  'remember_me': True}
    response = requests.post(f"{backend_server_api_url}/auth/jwt/login", data=login_data)
    if response.status_code != 200:
        raise Exception("Error logging to MWB.", response.text)

    access_token = json.loads(response.text)['access_token']
    logging.info("Logging to MWB done.")
    auth_headers = {'Authorization': f'Bearer {access_token}'}
    return auth_headers


def reset_mwb():
    if not settings.DEBUG_MODE:
        logging.error("DEBUG_MODE is disabled. Please enable DEBUG_MODE in .env file.")
        return

    if not settings.MW_RESET_MONGO_DB_QUERY:
        logging.error(
            f"RESET QUERY does not exist. Ensure that you have have updated the .env file with the correct RESET QUERY.")
        return

    delete_mwb_db()

    auth_headers = login_to_mwb()

    import_eforms(auth_headers)

    discover_terms(auth_headers)

    import_namespaces(auth_headers)

    logging.info("Resetting MWB done. Necessary tasks have been started.")


if __name__ == "__main__":
    #print(settings.MW_RESET_MONGO_DB_QUERY)
    reset_mwb()
