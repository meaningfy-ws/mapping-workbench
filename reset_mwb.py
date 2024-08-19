import logging
import pathlib
import subprocess
import sys
from mapping_workbench.backend.config import settings

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

if __name__ == "__main__":

    result_backup_folder_path = pathlib.Path(__file__).parent.resolve() / ".mongodump"
    admin_db = "admin"

    subprocess_result = subprocess.run(
        [f'mongosh {settings.DATABASE_URL}{settings.DATABASE_NAME} --authenticationDatabase={admin_db} --eval "db.dropDatabase()"'],
        capture_output=True, text=True, shell=True)

    if subprocess_result.returncode != 0:
        raise Exception("Error clearing MWB database.", subprocess_result.stderr)
    else:
        logging.info("Deleting MWB database done.")


    subprocess_result = subprocess.run(
        [f'mongorestore --uri {settings.DATABASE_URL}{settings.DATABASE_NAME} {result_backup_folder_path}/{settings.DATABASE_NAME} --authenticationDatabase={admin_db}'],
        capture_output=True, text=True, shell=True)

    if subprocess_result.returncode != 0:
        raise Exception("Error clearing MWB database.", subprocess_result.stderr)
    else:
        logging.info("Mongo dump restored successfully.")