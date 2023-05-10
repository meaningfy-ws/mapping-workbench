from typing import Annotated

from fastapi import Depends, APIRouter

from mapping_workbench.security.services.authentication import auth_scheme
from mapping_workbench.user.models.user import User

router = APIRouter()

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}


def fake_decode_token(token):
    return User(
        username=token + "fake_decoded", email="john@example.com", full_name="John Doe"
    )


async def get_current_user(token: Annotated[str, Depends(auth_scheme)]):
    user = fake_decode_token(token)
    return user


@router.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
