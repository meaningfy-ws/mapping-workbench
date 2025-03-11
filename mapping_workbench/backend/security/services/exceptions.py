from fastapi import status, HTTPException


def throw_403_exception():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="The user cannot perform this action",
    )