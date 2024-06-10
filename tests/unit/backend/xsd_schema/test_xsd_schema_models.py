import pytest
from pydantic import ValidationError

from mapping_workbench.backend.xsd_schema.models.xsd_file_resource import XSDFileResource, XSDFileResourceIn, \
    XSDFileResourceOut


def test_xsd_file_has_mandatory_fields():
    with pytest.raises(ValidationError):
        XSDFileResource(project=None)

    # TODO: Nice to see how to be able to validate this case having beanie Link field
    # with pytest.raises(ValidationError):
    #     xsd_file = XSDFile()

    with pytest.raises(ValidationError):
        XSDFileResourceIn()

    with pytest.raises(ValidationError):
        XSDFileResourceOut()


def test_xsd_file_in():
    with pytest.raises(ValidationError):
        XSDFileResourceIn(
            filename="filename.lfa",
            content="abcdefghijcklmn"
        )

    with pytest.raises(ValidationError):
        XSDFileResourceIn(
            filename="filename.xsd.sd",
            content="abcdefghijcklmn"
        )

    XSDFileResourceIn(
        filename="filename.xsd",
        content="abcdefghijcklmn"
    )