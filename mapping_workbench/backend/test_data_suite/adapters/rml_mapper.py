import abc
import os
import subprocess
from enum import Enum
from pathlib import Path

from mapping_workbench.backend.test_data_suite.services import TRANSFORMATION_PATH_NAME, MAPPINGS_PATH_NAME, \
    RESOURCES_PATH_NAME


class SerializationFormat(Enum):
    NQUADS = "nquads"
    TURTLE = "turtle"
    TRIG = "trig"
    TRIX = "trix"
    JSONLD = "jsonld"
    HDT = "hdt"


DEFAULT_SERIALIZATION_FORMAT = SerializationFormat.NQUADS
TURTLE_SERIALIZATION_FORMAT = SerializationFormat.TURTLE


class RMLMapperABC(abc.ABC):
    """
        This class is a general interface of an adapter for rml-mapper.
    """
    serialization_format: SerializationFormat

    def set_serialization_format(self, serialization_format: SerializationFormat):
        """
        """
        self.serialization_format = serialization_format

    def get_serialization_format(self) -> SerializationFormat:
        """
        Get serialization_format
        :return:
        """
        return self.serialization_format

    def get_serialization_format_value(self) -> str:
        """
        Get serialization_format value
        :return:
        """
        return self.get_serialization_format().value

    @abc.abstractmethod
    def execute(self, data_path: Path) -> str:
        """
        """


class RMLMapper(RMLMapperABC):
    """
        This class is a concrete implementation of the rml-mapper adapter.
    """

    def __init__(self, rml_mapper_path: Path,
                 serialization_format: SerializationFormat = TURTLE_SERIALIZATION_FORMAT
                 ):
        """
        """
        self.rml_mapper_path = rml_mapper_path
        self.serialization_format = serialization_format

    def execute(self, data_path: Path) -> str:
        """
        """
        # java -jar ./rmlmapper.jar -m rml.ttl -s turtle  -o output.ttl
        bash_script = f"cd {data_path} && java -jar {self.rml_mapper_path} -m {data_path / TRANSFORMATION_PATH_NAME / MAPPINGS_PATH_NAME / '*'} -s {self.get_serialization_format_value()}"
        print("K :: ", bash_script)
        process = subprocess.Popen(
            bash_script,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            start_new_session=True
        )
        output, error = process.communicate()
        error = error.decode(encoding="utf-8")
        if error:
            raise Exception(error)
        return output.decode(encoding="utf-8")
