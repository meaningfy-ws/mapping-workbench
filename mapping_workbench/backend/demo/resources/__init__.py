import pathlib

RESOURCES_PATH = pathlib.Path(__file__).parent.resolve()

PROJECTS_PATH = RESOURCES_PATH / "projects"

PROJECT1_PATH = PROJECTS_PATH / 'project1' / 'src'
PROJECT2_PATH = PROJECTS_PATH / 'project2' / 'mappings' / 'UBL-ePO-mapping'
