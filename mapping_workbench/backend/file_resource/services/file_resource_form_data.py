from typing import Dict

from fastapi import UploadFile
from starlette.datastructures import FormData
from starlette.requests import Request


async def file_resource_data_from_form_request(req: Request) -> Dict:
    form_data: FormData = await req.form()
    data = {k: v for k, v in form_data.items()}
    if 'file' in data:
        del data['file']
        file: UploadFile = form_data.get("file")
        data['content'] = await file.read()
    await form_data.close()
    return data
