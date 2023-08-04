from beanie import Document
from fastapi_users_db_beanie.access_token import BeanieBaseAccessToken


class AccessToken(BeanieBaseAccessToken, Document):
    class Settings(BeanieBaseAccessToken.Settings):
        name = "access_tokens"
