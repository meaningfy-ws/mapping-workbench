from typing import Dict

from starlette.requests import Request

from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request


async def test_data_file_resource_data_from_form_request(req: Request) -> Dict:
    data = await file_resource_data_from_form_request(req)
    if ('rdf_manifestation' in data) and data['rdf_manifestation']:
        data['rdf_manifestation'] = {'content': data['rdf_manifestation']}
    else:
        data['rdf_manifestation'] = {}
    return data

