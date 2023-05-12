# MongoDB driver
from motor import motor_asyncio

from mapping_workbench.backend.config import settings

client = motor_asyncio.AsyncIOMotorClient(settings.DB_URL)
database = client[settings.DB_NAME]
