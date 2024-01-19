from typing import List, Optional

from pydantic import BaseModel, Field


class MappingMetadata(BaseModel):
    identifier: str = Field(..., alias="Identifier")
    title: str = Field(..., alias="Title")
    description: str = Field(..., alias="Description")
    mapping_version: str = Field(..., alias="Mapping Version")
    epo_version: str = Field(..., alias="EPO version")
    eform_subtypes: List[str] = Field(..., alias="eForms Subtype")
    start_date: Optional[str] = Field(..., alias="Start Date")
    end_date: Optional[str] = Field(..., alias="End Date")
    eforms_sdk_versions: List[str] = Field(..., alias="eForms SDK version")


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
    metadata: MappingMetadata
    conceptual_rules: List[MappingConceptualRule] = []
    transformation_resources: ExportedCollectionResource
    transformation_mappings: ExportedCollectionResource
    test_data_resources: List[ExportedCollectionResource] = []
    shacl_validation_resources: List[ExportedCollectionResource] = []
    sparql_validation_resources: List[ExportedCollectionResource] = []
    shacl_result_query: str



