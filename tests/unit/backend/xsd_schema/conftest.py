import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.xsd_schema.models.xsd_file_resource import XSDFileResourceIn
from tests import TEST_DATA_XSD_FILES_PATH


def get_xsd_file_resource_in_by_name(xsd_file_name: str) -> XSDFileResourceIn:
    file_path = TEST_DATA_XSD_FILES_PATH / xsd_file_name

    return XSDFileResourceIn(
        filename = file_path.name,
        content = file_path.read_text()
    )

@pytest.fixture
def dummy_xsd_file_resource_in_1() -> XSDFileResourceIn:
    return get_xsd_file_resource_in_by_name("EFORMS-ExtensionApex-2.3.xsd")

@pytest.fixture
def dummy_xsd_file_resource_in_2() -> XSDFileResourceIn:
    return get_xsd_file_resource_in_by_name("UBL-ExtensionContentDataType-2.3.xsd")


@pytest.fixture
def dummy_xsd_file_resource_in_3() -> XSDFileResourceIn:
    return get_xsd_file_resource_in_by_name("UBL-QualifiedDataTypes-2.3.xsd")

@pytest.fixture
def dummy_project_id() -> PydanticObjectId:
    return PydanticObjectId("6662ecf54741751a88f28132")