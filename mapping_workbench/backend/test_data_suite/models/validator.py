from beanie import Document

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG
from mapping_workbench.backend.core.models.base_entity import BaseEntity


class FileResourceValidationResult(Document):
    model_config = DEFAULT_MODEL_CONFIG

    class Settings(BaseEntity.Settings):
        name = "file_resource_validation_result"
