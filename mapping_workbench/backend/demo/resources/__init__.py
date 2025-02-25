import pathlib

RESOURCES_PATH = pathlib.Path(__file__).parent.resolve()

PROJECTS_PATH = RESOURCES_PATH / "projects"

PROJECT1_PATH = PROJECTS_PATH / 'project1' / 'src'
PROJECT2_PATH = PROJECTS_PATH / 'project2' / 'mappings' / 'UBL-ePO-mapping'

ONTOLOGY_FILE_NAME = 'ePO_core.ttl'
ONTOLOGY_FILE_PATH = RESOURCES_PATH / 'ontologies' / ONTOLOGY_FILE_NAME
