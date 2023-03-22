#!/usr/bin/python3

import json
import os
from pathlib import Path
from typing import List

import click
from ted_sws.core.adapters.cmd_runner import CmdRunnerForMappingSuite as BaseCmdRunner, DEFAULT_MAPPINGS_PATH, \
    DEFAULT_OUTPUT_PATH
from ted_sws.core.model.validation_report import ReportNotice
from ted_sws.data_manager.adapters.mapping_suite_repository import MappingSuiteRepositoryInFileSystem
from ted_sws.data_manager.services.mapping_suite_resource_manager import mapping_suite_notices_grouped_by_path
from ted_sws.event_manager.adapters.log import LOG_INFO_TEXT
from ted_sws.notice_validator.services.xpath_coverage_runner import xpath_coverage_html_report, \
    xpath_coverage_json_report, validate_xpath_coverage_notices, NOTICE_GROUPING_KEY

from mapping_workbench.workbench_tools.mapping_suite_processor.entrypoints.cli import CONCEPTUAL_MAPPINGS_FILE_TEMPLATE
from mapping_workbench.workbench_tools.notice_validator.entrypoints.cli import DEFAULT_TEST_SUITE_REPORT_FOLDER

OUTPUT_FOLDER = '{mappings_path}/{mapping_suite_id}/' + DEFAULT_OUTPUT_PATH
REPORT_FILE = "xpath_coverage_validation"
JSON_REPORT_FILE = REPORT_FILE + ".json"
CMD_NAME = "CMD_XPATH_COVERAGE_RUNNER"

"""
USAGE:
# xpath_coverage_runner --help
"""


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by Coverage Runner
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
        self.output_folder = OUTPUT_FOLDER.format(mappings_path=self.mappings_path,
                                                  mapping_suite_id=self.mapping_suite_id)

        self.package_output_path = Path(self.output_folder).resolve()

        repository_path = Path(self.mappings_path)

        mapping_suite_repository = MappingSuiteRepositoryInFileSystem(repository_path=repository_path)
        self.mapping_suite = mapping_suite_repository.get(reference=self.mapping_suite_id)

    @classmethod
    def save_json_report(cls, output_path, json_report: dict):
        with open(output_path, "w+") as f:
            json.dump(json_report, f, indent=4)
            f.close()

    @classmethod
    def save_html_report(cls, output_path, html_report: str):
        with open(output_path, "w+") as f:
            f.write(html_report)
            f.close()

    def coverage_report(self, notices: List[ReportNotice], output_path: Path, label: str, metadata: dict = None):
        self.log("Generating coverage report for " + LOG_INFO_TEXT.format(label) + " ... ")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        report = validate_xpath_coverage_notices(notices, self.mapping_suite)
        self.save_json_report(Path(str(output_path) + ".json"), xpath_coverage_json_report(report))
        if self.with_html:
            template_metadata = {"package_output_path": self.package_output_path}
            if metadata:
                template_metadata.update(metadata)
            self.save_html_report(Path(str(output_path) + ".html"),
                                  xpath_coverage_html_report(report, metadata=template_metadata))

    def run_cmd(self):
        super().run_cmd()

        output_path = Path(self.output_folder)
        notices: List[ReportNotice] = []

        report_file = REPORT_FILE

        grouped_notices = mapping_suite_notices_grouped_by_path(mapping_suite=self.mapping_suite,
                                                                notice_ids=self.notice_ids)
        for group_path in grouped_notices:
            report_notices = grouped_notices.get(group_path)
            group_notices: List[ReportNotice] = []
            metadata = {
                NOTICE_GROUPING_KEY: group_path
            }
            for report_notice in report_notices:
                notice = report_notice.notice
                notice_id = notice.ted_id

                report_path = output_path / group_path / notice_id / DEFAULT_TEST_SUITE_REPORT_FOLDER / report_file
                self.coverage_report(notices=[report_notice], output_path=report_path, label=notice_id,
                                     metadata=metadata)
                group_notices.append(report_notice)
            if group_notices:
                self.coverage_report(notices=group_notices, output_path=output_path / group_path / report_file,
                                     label='Group[' + str(group_path) + ']', metadata=metadata)
                notices += group_notices

        if notices:
            self.coverage_report(notices=notices, output_path=output_path / report_file,
                                 label='MappingSuite[' + self.mapping_suite_id + ']')

        return self.run_cmd_result()


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
    Generates Coverage Reports for Notices
    """
    run(mapping_suite_id, notice_id, opt_mappings_folder)


if __name__ == '__main__':
    main()
