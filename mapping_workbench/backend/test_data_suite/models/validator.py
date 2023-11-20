from datetime import datetime
from typing import Optional

from beanie import Document

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG
from mapping_workbench.backend.core.models.base_entity import BaseEntity


class TestDataValidationResult(Document):
    model_config = DEFAULT_MODEL_CONFIG
    created_at: Optional[datetime] = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.created_at = datetime.now()

    class Settings(BaseEntity.Settings):
        name = "file_resource_validation_result"
