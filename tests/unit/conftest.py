import pathlib
import pytest

from ted_sws import config
from ted_sws.notice_transformer.adapters.rml_mapper import RMLMapperABC, SerializationFormat as RMLSerializationFormat
from tests import TEST_DATA_PATH
from tests.fakes.fake_rml_mapper import FakeRMLMapper


@pytest.fixture
def fake_rml_mapper() -> RMLMapperABC:
    rml_mapper = FakeRMLMapper()
    rml_mapper.set_serialization_format(RMLSerializationFormat.TURTLE)
    return rml_mapper


@pytest.fixture
def fake_mapping_suite_id() -> str:
    return "test_package_fake"


@pytest.fixture
def invalid_mapping_suite_id() -> str:
    return "test_invalid_package"


@pytest.fixture
def aggregates_database_name():
    return config.MONGO_DB_AGGREGATES_DATABASE_NAME
