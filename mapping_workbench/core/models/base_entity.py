from pydantic import BaseModel


class BaseEntity(BaseModel):
    """
    The general model for entities
    """
    _id: str

    # created_at: str = datetime.now().replace(microsecond=0).isoformat()
    # updated_at: str = datetime.now().replace(microsecond=0).isoformat()

    class Config:
        validate_assignment = True
        orm_mode = True
        allow_population_by_field_name = True
