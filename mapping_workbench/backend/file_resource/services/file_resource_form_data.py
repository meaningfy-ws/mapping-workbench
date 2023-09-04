from typing import Dict

from fastapi import UploadFile
from starlette.datastructures import FormData
from starlette.requests import Request


async def file_resource_data_from_form_request(req: Request) -> Dict:
    data = {k: v for k, v in (await req.form()).items()}
    if ('path' in data) and data['path']:
        data['path'] = data['path'].split(',')
    return data

