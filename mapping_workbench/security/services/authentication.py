from fastapi.security import OAuth2PasswordBearer

auth_scheme = OAuth2PasswordBearer(tokenUrl="token")
