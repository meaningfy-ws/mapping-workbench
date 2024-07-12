from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class MappingMetadata(BaseModel):
    identifier: str = Field(None, alias="Identifier")
    title: str = Field(None, alias="Title")
    description: str = Field(None, alias="Description")
    mapping_version: str = Field(None, alias="Mapping Version")
    epo_version: str = Field(None, alias="EPO version")
    eform_subtypes: List[str] = Field(None, alias="eForms Subtype")
    start_date: Optional[str] = Field(None, alias="Start Date")
    end_date: Optional[str] = Field(None, alias="End Date")

    model_config = ConfigDict(
        populate_by_name=True,
    )


class EFormsMappingMetadata(MappingMetadata):
    eforms_sdk_versions: List[str] = Field(None, alias="eForms SDK version")


class StandardMappingMetadata(MappingMetadata):
    base_xpath: str = Field(None, alias="Base XPath")
    min_xsd_version: str = Field(None, alias="Min XSD Version")
    max_xsd_version: str = Field(None, alias="Max XSD Version")


class EFormsMappingConceptualRule(BaseModel):
    min_sdk_version: Optional[str] = Field(None, alias="Min SDK Version")
    max_sdk_version: Optional[str] = Field(None, alias="Max SDK Version")
    eforms_sdk_id: str = Field(..., alias="eForms SDK ID")
    field_name: Optional[str] = Field(None, alias="Name")
    bt_id: Optional[str] = Field(None, alias="BT ID")
    mapping_group_id: Optional[str] = Field(None, alias="Mapping Group ID")
    absolute_xpath: str = Field(..., alias="Absolute XPath")
    xpath_condition: Optional[str] = Field(..., alias="XPath Condition")
    class_path: Optional[str] = Field(None, alias="Class Path")
    property_path: Optional[str] = Field(None, alias="Property Path")
    status: Optional[str] = Field(None, alias="Status")
    mapping_notes: Optional[str] = Field(None, alias="Mapping Notes (public)")
    editorial_notes: Optional[str] = Field(None, alias="Editorial Notes (private)")
    feedback_notes: Optional[str] = Field(None, alias="Feedback Notes (private)")

    model_config = ConfigDict(
        populate_by_name=True,
    )


class StandardMappingConceptualRule(BaseModel):
    field_id: Optional[str] = Field(None, alias="Standard Form Field ID (M)")
    field_name: Optional[str] = Field(None, alias="Standard Form Field Name (M)")
    bt_id: Optional[str] = Field(None, alias="eForm BT-ID (Provisional/Indicative) (O)")
    bt_name: Optional[str] = Field(None, alias="eForm BT Name (Provisional/Indicative) (O)")
    absolute_xpath: Optional[str] = Field(..., alias="Field XPath (M)")
    relative_xpath: Optional[str] = Field(..., alias="Field XPath (M)")
    xpath_condition: Optional[str] = Field(..., alias="Field XPath condition (M)")
    class_path: Optional[str] = Field(None, alias="Class path (M)")
    property_path: Optional[str] = Field(None, alias="Property path (M)")
    reference_to_integration_tests: Optional[str] = Field(None, alias="Reference to Integration Tests (O)")
    rml_triple_map_reference: Optional[str] = Field(None, alias="RML TripleMap reference (O)")
    mapping_notes: Optional[str] = Field(None, alias="Notes (O)")

    model_config = ConfigDict(
        populate_by_name=True,
    )


class ImportedMappingGroup(BaseModel):
    mapping_group_id: Optional[str] = Field(None, alias="Mapping Group ID")
    ontology_class: Optional[str] = Field(None, alias="Instance Type (ontology Class)")
    iterator_xpath: str = Field(..., alias="Iterator XPath")
    triple_map: Optional[str] = Field(None, alias="TripleMap")

    model_config = ConfigDict(
        populate_by_name=True,
    )


class ImportedFileResource(BaseModel):
    name: str
    format: str
    content: str


class ImportedCollectionResource(BaseModel):
    name: str
    file_resources: List[ImportedFileResource] = []


class ImportedMappingSuite(BaseModel):
    transformation_resources: ImportedCollectionResource
    transformation_mappings: ImportedCollectionResource
    test_data_resources: List[ImportedCollectionResource] = []
    shacl_validation_resources: List[ImportedCollectionResource] = []
    sparql_validation_resources: List[ImportedCollectionResource] = []
    shacl_result_query: str


class ImportedEFormsMappingSuite(ImportedMappingSuite):
    metadata: EFormsMappingMetadata
    conceptual_rules: List[EFormsMappingConceptualRule] = []
    mapping_groups: List[ImportedMappingGroup] = []


class ImportedStandardMappingSuite(ImportedMappingSuite):
    metadata: StandardMappingMetadata
    conceptual_rules: List[StandardMappingConceptualRule] = []

