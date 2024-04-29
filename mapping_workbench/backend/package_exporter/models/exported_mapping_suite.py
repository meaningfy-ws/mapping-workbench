from enum import Enum
from typing import List, Optional, Union

from pydantic import BaseModel, Field, ConfigDict


class MappingSuiteType(str, Enum):
    STANDARD_FORMS = "standard_forms"
    ELECTRONIC_FORMS = "eforms"

    def __str__(self):
        return self.value


class StandardFormConstraints(BaseModel):
    """
    Metadata constraints structure for Standard forms
    """
    eforms_subtype: List[str]
    start_date: Optional[List[str]]
    end_date: Optional[List[str]]
    min_xsd_version: List[str]
    max_xsd_version: Optional[List[str]]


class EFormsConstraints(BaseModel):
    eforms_subtype: List[str]
    start_date: Optional[str]
    end_date: Optional[str]
    eforms_sdk_versions: List[str]


class MappingMetadataConstraints(BaseModel):
    constraints: Union[StandardFormConstraints, EFormsConstraints]


class MappingMetadataExportBaseForEForms(BaseModel):
    identifier: str
    title: str
    created_at: str
    description: str
    mapping_version: str
    ontology_version: str
    mapping_type: MappingSuiteType = MappingSuiteType.ELECTRONIC_FORMS
    metadata_constraints: MappingMetadataConstraints

    model_config = ConfigDict(use_enum_values=True)



class MappingMetadataExportForEForms(MappingMetadataExportBaseForEForms):
    mapping_suite_hash_digest: str


class MappingConceptualRule(BaseModel):
    min_sdk_version: Optional[str] = Field(None, alias="Min SDK Version")
    max_sdk_version: Optional[str] = Field(None, alias="Max SDK Version")
    eforms_sdk_id: str = Field(..., alias="eForms SDK ID")
    field_name: Optional[str] = Field(None, alias="Name")
    bt_id: Optional[str] = Field(None, alias="BT ID")
    mapping_group_id: Optional[str] = Field(None, alias="Mapping Group ID")
    absolute_xpath: str = Field(..., alias="Absolute XPath")
    class_path: Optional[str] = Field(None, alias="Class Path")
    property_path: Optional[str] = Field(None, alias="Property Path")
    status: Optional[str] = Field(None, alias="Status")
    mapping_notes: Optional[str] = Field(None, alias="Mapping Notes (public)")
    editorial_notes: Optional[str] = Field(None, alias="Editorial Notes (private)")
    feedback_notes: Optional[str] = Field(None, alias="Feedback Notes (private)")


class ExportedFileResource(BaseModel):
    name: str
    format: str
    content: str


class ExportedCollectionResource(BaseModel):
    name: str
    file_resources: List[ExportedFileResource] = []


class ExportedMappingSuite(BaseModel):
    metadata: Union[MappingMetadataExportForEForms]
    conceptual_rules: List[MappingConceptualRule] = []
    transformation_resources: ExportedCollectionResource
    transformation_mappings: ExportedCollectionResource
    test_data_resources: List[ExportedCollectionResource] = []
    shacl_validation_resources: List[ExportedCollectionResource] = []
    sparql_validation_resources: List[ExportedCollectionResource] = []
    shacl_result_query: str
