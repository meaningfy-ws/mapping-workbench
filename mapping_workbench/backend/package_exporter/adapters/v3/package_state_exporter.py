import json
import json
import tempfile
from io import StringIO
from pathlib import Path

import pandas as pd

from mapping_workbench.backend.core.adapters.archiver import ZipArchiver, ARCHIVE_ZIP_FORMAT
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_exporter.adapters.mapping_package_hasher import MappingPackageHasher
from mapping_workbench.backend.package_exporter.adapters.mapping_package_reporter import MappingPackageReporter
from mapping_workbench.backend.package_exporter.models.exported_mapping_suite import EFormsConstraints, \
    MappingMetadataConstraints, MappingMetadataExportBase, MappingMetadataExport
from mapping_workbench.backend.package_exporter.services.export_conceptual_mapping import \
    generate_eforms_conceptual_mapping_excel_by_mapping_package_state
from mapping_workbench.backend.package_importer.services.import_mapping_suite_v3 import TEST_DATA_DIR_NAME, \
    TRANSFORMATION_DIR_NAME, TRANSFORMATION_MAPPINGS_DIR_NAME, TRANSFORMATION_RESOURCES_DIR_NAME, VALIDATION_DIR_NAME, \
    SHACL_VALIDATION_DIR_NAME, SPARQL_VALIDATION_DIR_NAME, CONCEPTUAL_MAPPINGS_FILE_NAME, METADATA_FILE_NAME, \
    OUTPUT_DIR_NAME
from mapping_workbench.backend.package_validator.models.sparql_validation import SPARQLQueryRefinedResultType
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataValidation
from mapping_workbench.backend.user.models.user import User


class PackageStateExporter:
    package_state: MappingPackageState

    def __init__(self, package_state: MappingPackageState, project: Project, user: User = None):
        self.project = project
        self.package_state = package_state
        self.archiver = ZipArchiver()
        self.user = user

        self.tempdir = tempfile.TemporaryDirectory()
        tempdir_name = self.tempdir.name
        self.tempdir_path = Path(tempdir_name)
        self.package_path = self.tempdir_path / self.package_state.identifier
        self.archive_path = self.tempdir_path / "archive"
        self.archive_file_path = self.archive_path / f"{self.package_state.identifier}.{ARCHIVE_ZIP_FORMAT}"

        self.package_output_path = self.package_path / OUTPUT_DIR_NAME
        self.package_test_data_path = self.package_path / TEST_DATA_DIR_NAME
        self.package_transformation_path = self.package_path / TRANSFORMATION_DIR_NAME
        self.package_transformation_mappings_path = self.package_transformation_path / TRANSFORMATION_MAPPINGS_DIR_NAME
        self.package_transformation_resources_path = self.package_transformation_path / TRANSFORMATION_RESOURCES_DIR_NAME
        self.package_validation_path = self.package_path / VALIDATION_DIR_NAME
        self.package_validation_shacl_path = self.package_validation_path / SHACL_VALIDATION_DIR_NAME
        self.package_validation_sparql_path = self.package_validation_path / SPARQL_VALIDATION_DIR_NAME

    async def export(self) -> bytes:
        """

        :return:
        """
        self.create_dirs()
        await self.add_transformation_mappings()
        await self.add_transformation_resources()
        await self.add_test_data()
        await self.add_validation_shacl()
        await self.add_validation_sparql()
        await self.add_conceptual_mappings()
        await self.add_output()
        await self.add_metadata()

        self.archiver.make_archive(self.package_path, self.archive_file_path)

        with open(self.archive_file_path, 'rb') as zip_file:
            return zip_file.read()

    @classmethod
    def write_to_file(cls, file_path: Path, file_content: str):
        file_path.write_text(file_content, encoding="utf-8")

    @classmethod
    def create_dir(cls, path: Path):
        path.mkdir(parents=True, exist_ok=True)

    def create_dirs(self):
        self.create_dir(self.package_path)
        self.create_dir(self.archive_path)
        self.create_dir(self.package_output_path)
        self.create_dir(self.package_test_data_path)
        self.create_dir(self.package_transformation_path)
        self.create_dir(self.package_transformation_mappings_path)
        self.create_dir(self.package_transformation_resources_path)
        self.create_dir(self.package_validation_path)
        self.create_dir(self.package_validation_shacl_path)
        self.create_dir(self.package_validation_sparql_path)

    async def add_metadata(self):
        eforms_constraints = EFormsConstraints(eforms_subtype=self.package_state.eform_subtypes,
                                               start_date=self.package_state.start_date,
                                               end_date=self.package_state.end_date,
                                               eforms_sdk_versions=self.package_state.eforms_sdk_versions
                                               )
        metadata_constraints = MappingMetadataConstraints(constraints=eforms_constraints)
        mapping_metadata_base = MappingMetadataExportBase(
            identifier=self.package_state.identifier,
            title=self.package_state.title,
            created_at=str(self.package_state.created_at),
            description=self.package_state.description,
            mapping_version=self.package_state.mapping_version,
            ontology_version=self.package_state.epo_version,
            metadata_constraints=metadata_constraints
        )

        mapping_suite_hash_digest = MappingPackageHasher(
            mapping_package_path=self.package_path,
            mapping_package_metadata=mapping_metadata_base.model_dump()
        ).hash_mapping_package(with_version=self.package_state.mapping_version)

        mapping_metadata = MappingMetadataExport(
            **mapping_metadata_base.model_dump(),
            mapping_suite_hash_digest=mapping_suite_hash_digest
        )

        self.write_to_file(
            self.package_path / METADATA_FILE_NAME,
            json.dumps(mapping_metadata.model_dump(), indent=4)
        )

    async def add_conceptual_mappings(self):
        filepath = self.package_transformation_path / CONCEPTUAL_MAPPINGS_FILE_NAME
        with open(filepath, 'wb') as f:
            excel_bytes: bytes = await generate_eforms_conceptual_mapping_excel_by_mapping_package_state(
                self.package_state)
            f.write(excel_bytes)

    async def add_transformation_mappings(self):
        for triple_map_fragment in self.package_state.triple_map_fragments:
            filename: str = f"{triple_map_fragment.identifier}.{triple_map_fragment.format.value.lower()}" \
                if triple_map_fragment.identifier else triple_map_fragment.triple_map_uri
            self.write_to_file(
                self.package_transformation_mappings_path / filename,
                triple_map_fragment.triple_map_content
            )

    async def add_transformation_resources(self):
        for resource in self.package_state.resources:
            self.write_to_file(self.package_transformation_resources_path / resource.filename, resource.content)

    async def add_test_data(self):
        for test_data_suite in self.package_state.test_data_suites:
            test_data_suite_path = self.package_test_data_path / test_data_suite.title
            test_data_suite_path.mkdir(parents=True, exist_ok=True)
            for test_data in test_data_suite.test_data_states:
                self.write_to_file(test_data_suite_path / test_data.filename, test_data.xml_manifestation.content)

    async def add_validation_shacl(self):
        for shacl_test_suite in self.package_state.shacl_test_suites:
            shacl_test_suite_path = self.package_validation_shacl_path / shacl_test_suite.title
            shacl_test_suite_path.mkdir(parents=True, exist_ok=True)
            for shacl_test in shacl_test_suite.shacl_test_states:
                self.write_to_file(shacl_test_suite_path / shacl_test.filename, shacl_test.content)

    async def add_validation_sparql(self):
        for sparql_test_suite in self.package_state.sparql_test_suites:
            sparql_test_suite_path = self.package_validation_sparql_path / sparql_test_suite.title
            sparql_test_suite_path.mkdir(parents=True, exist_ok=True)
            for sparql_test in sparql_test_suite.sparql_test_states:
                self.write_to_file(sparql_test_suite_path / sparql_test.filename, sparql_test.content)

    def add_xpath_report(self, path: Path, data: TestDataValidation, filename: str):
        if data.validation.xpath:
            xpath_validation_result = data.validation.xpath.model_dump()
            xpaths_str = json.dumps(
                xpath_validation_result,
                indent=4,
                default=str
            )
            self.write_to_file(path / f"{filename}.json", xpaths_str)
            if xpaths_str:
                df = pd.read_json(StringIO(xpaths_str))
                df.to_csv(path / f"{filename}.csv")

            html_report = MappingPackageReporter.xpath_coverage_html_report(data.validation.xpath)
            self.write_to_file(path / f"{filename}.html", html_report)

    def add_shacl_report(self, path: Path, data: TestDataValidation, filename: str, is_summary: bool = False):
        if data.validation.shacl:
            shacl_validation_result = data.validation.shacl.model_dump()
            shacl_str = json.dumps(shacl_validation_result, indent=4, default=str)
            self.write_to_file(path / f"{filename}.json", shacl_str)

            if is_summary:
                html_report = MappingPackageReporter.shacl_summary_html_report(data.validation.shacl)
            else:
                html_report = MappingPackageReporter.shacl_html_report(data.validation.shacl)
            self.write_to_file(path / f"{filename}.html", html_report)

    def add_sparql_report(self, path: Path, data: TestDataValidation, filename: str):
        if data.validation.sparql:
            sparql_validation_result = data.validation.sparql.model_dump()
            sparql_str = json.dumps(sparql_validation_result, indent=4, default=str)
            self.write_to_file(path / f"{filename}.json", sparql_str)
            if data.validation.sparql.results:
                export_dict_list = []
                for sparql_validation_result in data.validation.sparql.results:
                    export_dict = sparql_validation_result.query.model_dump()
                    export_dict["query_result"] = sparql_validation_result.query_result
                    export_dict_list.append(export_dict)

                df = pd.DataFrame(export_dict_list)
                df.to_csv(path / f"{filename}.csv")

                html_report = MappingPackageReporter.sparql_html_report(data.validation.sparql)
                self.write_to_file(path / f"{filename}.html", html_report)

    def add_validation_summary_report(self, path: Path, data: TestDataValidation, filename: str):
        if data.validation.shacl:
            validation_summary_result = data.validation.model_dump()
            summary_str = json.dumps(validation_summary_result, indent=4, default=str)
            self.write_to_file(path / f"{filename}.json", summary_str)

            html_report = MappingPackageReporter.validation_summary_html_report(data.validation)

            self.write_to_file(path / f"{filename}.html", html_report)

    def add_sparql_summary_report(self, path: Path, data: TestDataValidation, filename: str):
        if data.validation.sparql:
            sparql_validation_result = data.validation.sparql.model_dump()
            sparql_str = json.dumps(sparql_validation_result, indent=4, default=str)
            self.write_to_file(path / f"{filename}.json", sparql_str)
            if data.validation.sparql.summary:
                export_dict_list = []
                for sparql_validation_result in data.validation.sparql.summary:
                    export_dict = sparql_validation_result.query.model_dump()
                    export_dict[SPARQLQueryRefinedResultType.VALID.value] = (
                        sparql_validation_result.result.valid.count
                    )
                    export_dict[SPARQLQueryRefinedResultType.UNVERIFIABLE.value] = (
                        sparql_validation_result.result.unverifiable.count
                    )
                    export_dict[SPARQLQueryRefinedResultType.INVALID.value] = (
                        sparql_validation_result.result.invalid.count
                    )
                    export_dict[SPARQLQueryRefinedResultType.ERROR.value] = (
                        sparql_validation_result.result.error.count
                    )
                    export_dict[SPARQLQueryRefinedResultType.WARNING.value] = (
                        sparql_validation_result.result.warning.count
                    )
                    export_dict[SPARQLQueryRefinedResultType.UNKNOWN.value] = (
                        sparql_validation_result.result.unknown.count
                    )
                    export_dict_list.append(export_dict)

                df = pd.DataFrame(export_dict_list)
                df.to_csv(path / f"{filename}.csv")

                html_report = MappingPackageReporter.sparql_summary_html_report(data.validation.sparql)
                self.write_to_file(path / f"{filename}.html", html_report)

    async def add_output(self):
        self.add_xpath_report(self.package_output_path, self.package_state, "xpath_coverage_report")
        self.add_shacl_report(self.package_output_path, self.package_state, "shacl_summary_report", True)
        self.add_sparql_summary_report(
            self.package_output_path, self.package_state, "sparql_summary_report"
        )
        for test_data_suite in self.package_state.test_data_suites:
            test_data_suite_output_path = self.package_output_path / test_data_suite.title
            test_data_suite_output_path.mkdir(parents=True, exist_ok=True)

            self.add_xpath_report(test_data_suite_output_path, test_data_suite, "xpath_coverage_report")
            self.add_shacl_report(test_data_suite_output_path, test_data_suite, "shacl_summary_report", True)
            self.add_sparql_summary_report(
                test_data_suite_output_path, test_data_suite, "sparql_summary_report"
            )

            for test_data in test_data_suite.test_data_states:
                test_data_output_path = test_data_suite_output_path / test_data.identifier
                test_data_output_path.mkdir(parents=True, exist_ok=True)

                if test_data.rdf_manifestation and test_data.rdf_manifestation.content:
                    self.write_to_file(test_data_output_path / test_data.rdf_manifestation.filename,
                                       test_data.rdf_manifestation.content)

                test_data_reports_output_path = test_data_suite_output_path / test_data.identifier / "reports"
                test_data_reports_output_path.mkdir(parents=True, exist_ok=True)

                self.add_xpath_report(test_data_reports_output_path, test_data, "xpath_coverage_report")
                self.add_sparql_report(test_data_reports_output_path, test_data, "sparql_validation_report")
                self.add_shacl_report(test_data_reports_output_path, test_data, "shacl_validation_report")

        self.add_validation_summary_report(
            self.package_output_path, self.package_state, "validation_summary_report"
        )
