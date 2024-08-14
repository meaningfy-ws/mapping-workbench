import pytest
from pydantic import ValidationError

from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource, \
    OntologyFileResourceIn, OntologyFileResourceOut, ONTOLOGY_FILE_FORMATS


def test_ontology_file_has_mandatory_fields():
    # with pytest.raises(ValidationError):
    #     OntologyFileResource(project=None)

    with pytest.raises(ValidationError):
        OntologyFileResourceIn()

    with pytest.raises(ValidationError):
        OntologyFileResourceOut()


def test_ontology_file_in():
    dummy_content = "123456789022345435745"
    with pytest.raises(ValidationError):
        OntologyFileResourceIn(
            filename="dummy_file.mp3",
            content=dummy_content
        )

    with pytest.raises(ValidationError):
        OntologyFileResourceIn(
            filename="dummy.file.mp3",
            content=dummy_content
        )

    for file_format in ONTOLOGY_FILE_FORMATS:
        tmp_ontology_file = OntologyFileResourceIn(
            filename=f"filename.{file_format}",
            content=dummy_content
        )
