#!/usr/bin/python3

import json
from pathlib import Path
from typing import List

import click
from ted_sws.core.adapters.cmd_runner import CmdRunnerForMappingSuite as BaseCmdRunner, DEFAULT_MAPPINGS_PATH
from ted_sws.core.model.manifestation import RDFManifestation, SHACLTestSuiteValidationReport
from ted_sws.data_manager.adapters.mapping_suite_repository import MappingSuiteRepositoryInFileSystem
from ted_sws.data_manager.services.mapping_suite_resource_manager import read_flat_file_resources, \
    mapping_suite_skipped_notice, file_resource_output_path
from ted_sws.event_manager.adapters.log import LOG_INFO_TEXT
from ted_sws.notice_transformer.services import DEFAULT_TRANSFORMATION_FILE_EXTENSION
from ted_sws.notice_validator.services.shacl_test_suite_runner import SHACLTestSuiteRunner, generate_shacl_report

from mapping_workbench.workbench_tools.notice_validator.entrypoints.cli import DEFAULT_RDF_FOLDER, \
    DEFAULT_TEST_SUITE_REPORT_FOLDER

HTML_REPORT = "shacl_{id}.html"
JSON_VALIDATIONS_REPORT = "shacl_validations.json"
CMD_NAME = "CMD_SHACL_RUNNER"

"""
USAGE:
# shacl_runner --help
"""


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by SHACL Runner
    """

    def __init__(
            self,
            mapping_suite_id,
            notice_ids: List[str],
            mappings_path
    ):
        super().__init__(name=CMD_NAME)
        self.with_html = True
        self.mapping_suite_id = mapping_suite_id
        self.notice_ids = self._init_list_input_opts(notice_ids)
        self.mappings_path = mappings_path

        repository_path = Path(self.mappings_path)
        mapping_suite_repository = MappingSuiteRepositoryInFileSystem(repository_path=repository_path)
        self.mapping_suite = mapping_suite_repository.get(reference=self.mapping_suite_id)

    @classmethod
    def save_report(cls, report_path, report_name, report_id, content):
        if report_id is not None:
            report_name = report_name.format(id=report_id)
        with open(report_path / report_name, "w+") as f:
            f.write(content)

    def validate(self, rdf_resource, base_report_path, notice_ids: List[str] = None):
        self.log("Validating " + LOG_INFO_TEXT.format(rdf_resource.file_name) + " ... ")
        rdf_file = Path(base_report_path / rdf_resource.file_name)
        rdf_manifestation = RDFManifestation(object_data=rdf_file.read_text(encoding="utf-8"))

        report_path = base_report_path / DEFAULT_TEST_SUITE_REPORT_FOLDER
        report_path.mkdir(parents=True, exist_ok=True)

        shacl_validations: List[SHACLTestSuiteValidationReport] = []
        shacl_test_suites = self.mapping_suite.shacl_test_suites
        for shacl_test_suite in shacl_test_suites:
            test_suite_execution = SHACLTestSuiteRunner(rdf_manifestation=rdf_manifestation,
                                                        shacl_test_suite=shacl_test_suite,
                                                        mapping_suite=self.mapping_suite).execute_test_suite()

            report: SHACLTestSuiteValidationReport = generate_shacl_report(
                shacl_test_suite_execution=test_suite_execution, notice_ids=notice_ids, with_html=self.with_html)

            suite_id = shacl_test_suite.identifier
            self.save_report(report_path, HTML_REPORT, suite_id, report.object_data)
            report.object_data = "SHACLTestSuiteValidationReport"
            shacl_validations.append(report)

        self.save_report(report_path, JSON_VALIDATIONS_REPORT, None,
                         json.dumps(shacl_validations, default=lambda o: o.dict(), sort_keys=True, indent=4))

    def run_cmd(self):
        super().run_cmd()

        error = None
        try:
            rdf_path = Path(DEFAULT_RDF_FOLDER.format(mappings_path=self.mappings_path,
                                                      mapping_suite_id=self.mapping_suite_id))
            assert rdf_path.is_dir()
            file_resources = read_flat_file_resources(rdf_path, extension=DEFAULT_TRANSFORMATION_FILE_EXTENSION)
            for file_resource in file_resources:
                notice_id = file_resource.parents[-1]
                if mapping_suite_skipped_notice(notice_id, self.notice_ids):
                    continue
                base_report_path = file_resource_output_path(file_resource, rdf_path)
                self.validate(rdf_resource=file_resource, base_report_path=base_report_path, notice_ids=[notice_id])
        except Exception as e:
            error = e

        return self.run_cmd_result(error)


def run(mapping_suite_id=None, notice_id=None, opt_mappings_folder=DEFAULT_MAPPINGS_PATH):
    cmd = CmdRunner(
        mapping_suite_id=mapping_suite_id,
        notice_ids=list(notice_id or []),
        mappings_path=opt_mappings_folder
    )
    cmd.run()


@click.command()
@click.argument('mapping-suite-id', nargs=1, required=False)
@click.option('--notice-id', required=False, multiple=True, default=None)
@click.option('-m', '--opt-mappings-folder', default=DEFAULT_MAPPINGS_PATH)
def main(mapping_suite_id, notice_id, opt_mappings_folder):
    """
    Generates SHACL Validation Reports for RDF files
    """
    run(mapping_suite_id, notice_id, opt_mappings_folder)


if __name__ == '__main__':
    main()
