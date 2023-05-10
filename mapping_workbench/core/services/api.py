from fastapi import FastAPI
from pymongo import MongoClient

from mapping_workbench.config import settings

from mapping_workbench.user.models.user import User

app = FastAPI()
mongodb_client = MongoClient(settings.DB_URL)
mongodb = mongodb_client[settings.DB_NAME]


#
# @app.on_event("startup")
# async def on_startup():
#     await init_beanie(
#         database=mongodb,
#         document_models=[
#             User
#         ],
#     )
