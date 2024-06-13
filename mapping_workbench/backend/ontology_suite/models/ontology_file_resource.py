import pymongo
from pydantic import BaseModel, Field, field_validator
from pymongo import IndexModel

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG
from mapping_workbench.backend.file_resource.models.file_resource import FileResource

ONTOLOGY_FILE_FORMATS = [
    'ttl'
]


class OntologyFileResource(FileResource):
    model_config = DEFAULT_MODEL_CONFIG

    class Settings(FileResource.Settings):
        name = "ontology_files"

        indexes = [
            IndexModel(
                [("filename", pymongo.TEXT),
                 ("project", pymongo.TEXT)],
                name="ontology_file_index",
                unique=True
            )
        ]


# TODO: Current not from FileResourceIn
class OntologyFileResourceIn(BaseModel):
    model_config = DEFAULT_MODEL_CONFIG

    filename: str = Field(min_length=4, max_length=256, pattern=r'.+\.[A-Za-z]{3}$')
    content: str = Field(min_length=1)

    @field_validator('filename')
    @classmethod
    def check_filename_extension(cls, filename: str) -> str:
        filename_extension = filename.split(".")[-1]
        if filename_extension not in ONTOLOGY_FILE_FORMATS:
            raise ValueError(
                f"filename extension must be one from: {ONTOLOGY_FILE_FORMATS}, but now it is: {filename_extension}")

        return filename


class OntologyFileResourceOut(BaseModel):
    model_config = DEFAULT_MODEL_CONFIG

    filename: str
    content: str
