import json
import tempfile
from io import StringIO
from pathlib import Path

import pandas as pd

from mapping_workbench.backend.core.adapters.archiver import ZipArchiver, ARCHIVE_ZIP_FORMAT
from mapping_workbench.backend.mapping_package.models.entity import MappingPackageState
from mapping_workbench.backend.package_exporter.models.exported_mapping_suite import EFormsConstraints, \
    MappingMetadataExport, MappingMetadataConstraints
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import MappingMetadata
from mapping_workbench.backend.project.models.entity import Project
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

        self.package_output_path = self.package_path / "output"
        self.package_test_data_path = self.package_path / "test_data"
        self.package_transformation_path = self.package_path / "transformation"
        self.package_transformation_mappings_path = self.package_transformation_path / "mappings"
        self.package_transformation_resources_path = self.package_transformation_path / "resources"
        self.package_validation_path = self.package_path / "validation"
        self.package_validation_shacl_path = self.package_validation_path / "shacl"
        self.package_validation_sparql_path = self.package_validation_path / "sparql"

    async def export(self) -> bytes:
        """

        :return:
        """
        self.create_dirs()
        await self.add_metadata()
        await self.add_transformation_mappings()
        await self.add_transformation_resources()
        await self.add_test_data()
        await self.add_validation_shacl()
        await self.add_validation_sparql()
        await self.add_output()

        self.archiver.make_archive(self.package_path, self.archive_file_path)

        with open(self.archive_file_path, 'rb') as zip_file:
            return zip_file.read()

    @classmethod
    def write_to_file(cls, file_path: Path, file_content: str):
        file_path.write_text(file_content, encoding="utf-8")

    def create_dirs(self):
        self.package_path.mkdir(parents=True, exist_ok=True)
        self.archive_path.mkdir(parents=True, exist_ok=True)
        self.package_output_path.mkdir(parents=True, exist_ok=True)
        self.package_test_data_path.mkdir(parents=True, exist_ok=True)
        self.package_transformation_path.mkdir(parents=True, exist_ok=True)
        self.package_transformation_mappings_path.mkdir(parents=True, exist_ok=True)
        self.package_transformation_resources_path.mkdir(parents=True, exist_ok=True)
        self.package_validation_path.mkdir(parents=True, exist_ok=True)
        self.package_validation_shacl_path.mkdir(parents=True, exist_ok=True)
        self.package_validation_sparql_path.mkdir(parents=True, exist_ok=True)

    async def add_metadata(self):
        eforms_constraints = EFormsConstraints(eforms_subtype=self.package_state.eform_subtypes,
                                               start_date=self.package_state.start_date,
                                               end_date=self.package_state.end_date,
                                               eforms_sdk_versions=self.package_state.eforms_sdk_versions
                                               )
        metadata_constraints = MappingMetadataConstraints(constraints=eforms_constraints)
        mapping_metadata = MappingMetadataExport(identifier=self.package_state.identifier,
                                                 title=self.package_state.title,
                                                 description=self.package_state.description,
                                                 mapping_version=self.package_state.mapping_version,
                                                 ontology_version=self.package_state.epo_version,
                                                 metadata_constraints=metadata_constraints
                                                 )

        self.write_to_file(
            self.package_path / "metadata.json",
            json.dumps(mapping_metadata.model_dump(), indent=4)
        )

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

    async def get_validation_reports(self):
        return self.package_state.test_data_suites
        reports = {"xpath": [], "sparql": [], "shacl": []}
        for test_data_suite in self.package_state.test_data_suites:
            for test_data in test_data_suite.test_data_states:
                if test_data.xpath_validation_result:
                    for xpath_validation_result in test_data.xpath_validation_result:
                        reports["xpath"].append(xpath_validation_result)
                if test_data.sparql_validation_result:
                    reports["sparql"].append(test_data.sparql_validation_result)
                if test_data.shacl_validation_result:
                    reports["shacl"].append(test_data.shacl_validation_result)
        return reports

    async def get_xpath_reports(self):
        result = {}
        for test_data_suite in self.package_state.test_data_suites:
            for test_data in test_data_suite.test_data_states:
                if test_data.xpath_validation_result:
                    result[test_data.identifier] = test_data.xpath_validation_result
        return result

    async def get_sparql_reports(self):
        result = {}
        for test_data_suite in self.package_state.test_data_suites:
            for test_data in test_data_suite.test_data_states:
                if test_data.sparql_validation_result:
                    result[test_data.identifier] = test_data.sparql_validation_result.ask_results
        return result

    async def get_shacl_reports(self):
        result = {}
        for test_data_suite in self.package_state.test_data_suites:
            for test_data in test_data_suite.test_data_states:
                if test_data.shacl_validation_result:
                    result[test_data.identifier] = test_data.shacl_validation_result.results_dict["results"]["bindings"]
        return result

    async def get_validation_report_files(self):
        files = []
        for test_data_suite in self.package_state.test_data_suites:
            for test_data in test_data_suite.test_data_states:
                if test_data.identifier:
                    files.append(test_data.identifier)
        return files


    async def add_output(self):
        for test_data_suite in self.package_state.test_data_suites:
            test_data_suite_output_path = self.package_output_path / test_data_suite.title
            test_data_suite_output_path.mkdir(parents=True, exist_ok=True)
            for test_data in test_data_suite.test_data_states:
                test_data_output_path = test_data_suite_output_path / test_data.identifier
                test_data_output_path.mkdir(parents=True, exist_ok=True)

                if test_data.rdf_manifestation and test_data.rdf_manifestation.content:
                    self.write_to_file(test_data_output_path / test_data.rdf_manifestation.filename,
                                       test_data.rdf_manifestation.content)

                test_data_reports_output_path = test_data_suite_output_path / test_data.identifier / "reports"
                test_data_reports_output_path.mkdir(parents=True, exist_ok=True)

                if test_data.xpath_validation_result:
                    xpaths_str = json.dumps([xpath_validation_result.model_dump(
                        exclude={'id'}
                    ) for xpath_validation_result in test_data.xpath_validation_result], indent=4)
                    self.write_to_file(test_data_reports_output_path / "xpath_coverage_report.json", xpaths_str)
                    if xpaths_str:
                        df = pd.read_json(StringIO(xpaths_str))
                        df.to_csv(test_data_reports_output_path / "xpath_coverage_report.csv")

                if test_data.sparql_validation_result:
                    sparql_validation_result = test_data.sparql_validation_result.model_dump(
                        exclude={'id'}
                    )
                    sparql_str = json.dumps(sparql_validation_result, indent=4)
                    self.write_to_file(test_data_reports_output_path / "sparql_validation_report.json", sparql_str)
                    if test_data.sparql_validation_result.ask_results:
                        export_dict_list = []
                        for sparql_validation_result in test_data.sparql_validation_result.ask_results:
                            export_dict = sparql_validation_result.query.model_dump()
                            export_dict["query_result"] = sparql_validation_result.query_result
                            export_dict_list.append(export_dict)

                        df = pd.DataFrame(export_dict_list)
                        df.to_csv(test_data_reports_output_path / "sparql_assertions_report.csv")

                if test_data.shacl_validation_result:
                    shacl_str = json.dumps(test_data.shacl_validation_result.model_dump(
                        exclude={'id'}
                    ), indent=4)
                    self.write_to_file(test_data_reports_output_path / "shacl_validation_report.json", shacl_str)
                    shacl_dict = json.loads(shacl_str)
                    results = shacl_dict["results_dict"]["results"]["bindings"]
                    rows_of_results = [{key: result_instance["value"] for key, result_instance in result.items()}
                                       for result in results]
                    df = pd.DataFrame(rows_of_results)
                    df.to_csv(test_data_reports_output_path / "shacl_validation_report.csv")
