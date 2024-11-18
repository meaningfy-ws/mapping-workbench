import importlib.resources as pkg_resources
import json
import mapping_workbench.backend.ontology.resources as ontology_resources
from typing import Dict


def get_ontology_resource_map(resource: str) -> Dict[str, str]:
    with pkg_resources.path(ontology_resources, resource) as path:
        return json.loads(path.read_bytes())
