from typing import Dict

from starlette.requests import Request

from mapping_workbench.backend.file_resource.services.file_resource_form_data import \
    file_resource_data_from_form_request


async def sparql_test_file_resource_data_from_form_request(req: Request) -> Dict:
    data = await file_resource_data_from_form_request(req)
    data['query'] = {
        'title': data['query_title'] or '',
        'description': data['query_description'] or '',
        'xpath': (data['query_xpath'] or '').split(',')
    }
    del data['query_title']
    del data['query_description']
    del data['query_xpath']

    return data

