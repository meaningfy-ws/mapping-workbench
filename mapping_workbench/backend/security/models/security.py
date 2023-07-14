from beanie import Document
from fastapi_users_db_beanie.access_token import BeanieBaseAccessToken
from datetime import timedelta


class AccessToken(BeanieBaseAccessToken, Document):
    """Access token details"""

    class Settings(BeanieBaseAccessToken.Settings):
        name = "access_tokens"


class RefreshToken(AccessToken):
    """Access and refresh token details"""

    refresh_token: str
    refresh_token_expires: timedelta = timedelta(days=30)
