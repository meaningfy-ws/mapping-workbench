import pymongo
from pydantic import BaseModel, Field, field_validator
from pymongo import IndexModel

from mapping_workbench.backend import DEFAULT_MODEL_CONFIG
from mapping_workbench.backend.file_resource.models.file_resource import FileResource

XSD_FILE_FORMATS = [
    'xsd'
]


class XSDFileResource(FileResource):
    model_config = DEFAULT_MODEL_CONFIG

    class Settings(FileResource.Settings):
        name = "xsd_files"

        indexes = [
            IndexModel(
                [("filename", pymongo.TEXT),
                 ("project", pymongo.TEXT)],
                name="xsd_file_index"
            )
        ]


# TODO: Current not from FileResourceIn
class XSDFileResourceIn(BaseModel):
    model_config = DEFAULT_MODEL_CONFIG

    filename: str = Field(min_length=4, max_length=256, pattern=r'.+\.[A-Za-z]{3}$')
    content: str = Field(min_length=1)

    @field_validator('filename')
    @classmethod
    def check_filename_extension(cls, filename: str) -> str:
        filename_extension = filename.split(".")[-1]
        if filename_extension not in XSD_FILE_FORMATS:
            raise ValueError(
                f"filename extension must be one from: {XSD_FILE_FORMATS}, but now it is: {filename_extension}")

        return filename


class XSDFileResourceOut(BaseModel):
    model_config = DEFAULT_MODEL_CONFIG

    filename: str
    content: str
