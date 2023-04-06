#!/usr/bin/python3

import json
from pathlib import Path
from typing import List

import click
from ted_sws.core.adapters.cmd_runner import CmdRunnerForMappingSuite as BaseCmdRunner, DEFAULT_MAPPINGS_PATH
from ted_sws.core.model.manifestation import RDFManifestation
from ted_sws.core.model.notice import Notice, NoticeStatus
from ted_sws.core.model.transform import MappingSuite, FileResource
from ted_sws.core.model.validation_report import SPARQLValidationSummaryReport, ReportNotice
from ted_sws.data_manager.adapters.mapping_suite_repository import MappingSuiteRepositoryInFileSystem
from ted_sws.data_manager.services.mapping_suite_resource_manager import read_flat_file_resources, \
    mapping_suite_notices_grouped_by_path
from ted_sws.event_manager.adapters.log import LOG_INFO_TEXT
from ted_sws.notice_transformer.services import DEFAULT_TRANSFORMATION_FILE_EXTENSION

from mapping_workbench.workbench_tools.mapping_suite_processor import OUTPUT_FOLDER, DEFAULT_TEST_SUITE_REPORT_FOLDER
from mapping_workbench.workbench_tools.notice_validator.entrypoints.cli.cmd_xpath_query_runner import \
    XPATH_QUERY_JSON_REPORT_FILE
from mapping_workbench.workbench_tools.notice_validator.model.sparql_report_notice import SPARQLReportNotice
from mapping_workbench.workbench_tools.notice_validator.model.xpath_query_report import XPATHQueryReport
from mapping_workbench.workbench_tools.notice_validator.services.sparql_with_xpath_query import \
    validate_notice_with_sparql_suite, generate_sparql_validation_summary_report

JSON_VALIDATIONS_REPORT = "sparql_validations.json"
HTML_REPORT = "sparql_{id}.html"
CMD_NAME = "CMD_SPARQL_RUNNER"

"""
USAGE:
# sparql_runner --help
"""


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by SPARQL Runner
    """

    notice_ids: List[str] = []

    def __init__(
            self,
            mapping_suite_ids: List[str],
            notice_ids: List[str],
            mappings_path,
            output=".",
            only_inner_overall=False
    ):
        super().__init__(name=CMD_NAME)
        self.mapping_suite_ids = self._init_list_input_opts(mapping_suite_ids)
        self.notice_ids = self._init_list_input_opts(notice_ids)
        self.mappings_path = mappings_path
        self.output = output

        self.only_inner_overall = only_inner_overall
        self.is_for_inner_packages = len(self.mapping_suite_ids) > 1 and self.only_inner_overall
        self.is_notice_report = not self.only_inner_overall
        self.is_group_report = not self.only_inner_overall
        self.is_mapping_suite_report = not self.only_inner_overall

    def get_output_path(self, mapping_suite_id=None):
        if mapping_suite_id:
            return Path(OUTPUT_FOLDER.format(mappings_path=self.mappings_path, mapping_suite_id=mapping_suite_id))
        else:
            return Path(self.output)

    @classmethod
    def get_abs_output_path(cls, output_path: Path):
        return output_path.resolve()

    def get_mapping_suite(self, mapping_suite_id) -> MappingSuite:
        repository_path = Path(self.mappings_path)
        mapping_suite_repository = MappingSuiteRepositoryInFileSystem(repository_path=repository_path)
        return mapping_suite_repository.get(reference=mapping_suite_id)

    @classmethod
    def get_file_resources(cls, path: Path, file_resources: List[FileResource] = None):
        return read_flat_file_resources(
            path=path,
            file_resources=file_resources,
            extension=DEFAULT_TRANSFORMATION_FILE_EXTENSION,
            with_content=False
        )

    def get_grouped_notices(self, file_resources: List[FileResource]):
        return mapping_suite_notices_grouped_by_path(
            file_resources=file_resources,
            with_content=False,
            notice_ids=self.notice_ids,
            group_depth=1
        )

    @classmethod
    def save_report(cls, report_path, report_name, report_id, content):
        if report_id is not None:
            report_name = report_name.format(id=report_id)
        with open(report_path / report_name, "w+") as f:
            f.write(content)

    def sparql_validation_summary_report(self, report_notices: List[SPARQLReportNotice], mapping_suite: MappingSuite,
                                         report: SPARQLValidationSummaryReport = None, metadata: dict = None) -> \
            SPARQLValidationSummaryReport:
        return generate_sparql_validation_summary_report(
            report_notices=report_notices,
            mapping_suite_package=mapping_suite,
            report=report,
            metadata=metadata
        )

    def validate_notices(self, output_path: Path, label: str, report: SPARQLValidationSummaryReport):
        self.log("Validating " + LOG_INFO_TEXT.format(label) + " ... ")

        output_path.mkdir(parents=True, exist_ok=True)

        self.save_report(output_path, HTML_REPORT, "validations", report.object_data)

        del report.object_data
        self.save_report(
            output_path,
            JSON_VALIDATIONS_REPORT, None,
            json.dumps(report, default=lambda o: o.dict(), sort_keys=True, indent=4)
        )

    def validate_notice(self, report_notice: SPARQLReportNotice, mapping_suite: MappingSuite, base_report_path: Path):
        notice: Notice = report_notice.notice
        self.log("Validating " + LOG_INFO_TEXT.format("Notice[" + notice.ted_id + "]") + " ... ")
        validate_notice_with_sparql_suite(
            notice=notice,
            mapping_suite_package=mapping_suite,
            xpath_query_report=report_notice.xpath_query_report
        )
        report_path = base_report_path / DEFAULT_TEST_SUITE_REPORT_FOLDER
        report_path.mkdir(parents=True, exist_ok=True)
        sparql_validations = notice.rdf_manifestation.sparql_validations
        for report in sparql_validations:
            self.save_report(report_path, HTML_REPORT, report.test_suite_identifier, report.object_data)
            del report.object_data

        self.save_report(
            report_path,
            JSON_VALIDATIONS_REPORT, None,
            json.dumps(sparql_validations, default=lambda o: o.dict(), sort_keys=True, indent=4)
        )

    @classmethod
    def notice_xpath_query_report(cls, base_report_path) -> XPATHQueryReport:
        xpath_query_file = base_report_path / DEFAULT_TEST_SUITE_REPORT_FOLDER / XPATH_QUERY_JSON_REPORT_FILE
        xpath_report = json.load(open(xpath_query_file, "r")) if xpath_query_file.exists() else None
        return XPATHQueryReport(**xpath_report)

    @classmethod
    def generate_notice(cls, notice_id, base_report_path) -> Notice:
        notice: Notice = Notice(ted_id=notice_id)
        notice._status = NoticeStatus.TRANSFORMED

        rdf_file = Path(base_report_path / Path(notice_id + DEFAULT_TRANSFORMATION_FILE_EXTENSION))
        notice.set_rdf_manifestation(RDFManifestation(object_data=rdf_file.read_text(encoding="utf-8")))
        notice.set_distilled_rdf_manifestation(notice.rdf_manifestation)

        return notice

    @classmethod
    def generate_sparql_report_notice(cls, notice: Notice, report_notice: ReportNotice,
                                      base_report_path) -> SPARQLReportNotice:
        sparql_report_notice = SPARQLReportNotice(**report_notice.dict())
        sparql_report_notice.notice = notice
        sparql_report_notice.xpath_query_report = cls.notice_xpath_query_report(base_report_path=base_report_path)

        return sparql_report_notice

    def generate_reports(self):
        notices: List[SPARQLReportNotice] = []
        mapping_suite: MappingSuite
        template_metadata = {"output_path": self.get_abs_output_path(Path("."))}
        overall_report: SPARQLValidationSummaryReport
        if self.is_for_inner_packages:
            overall_report = SPARQLValidationSummaryReport(object_data="")
        for mapping_suite_id in self.mapping_suite_ids:
            rdf_path = self.get_output_path(mapping_suite_id=mapping_suite_id)
            assert rdf_path.is_dir()

            mapping_suite = self.get_mapping_suite(mapping_suite_id=mapping_suite_id)

            ms_notices: List[SPARQLReportNotice] = []
            file_resources = self.get_file_resources(path=rdf_path)
            grouped_notices = self.get_grouped_notices(file_resources=file_resources)
            for group_path in grouped_notices:
                report_notices = grouped_notices.get(group_path)
                group_notices: List[SPARQLReportNotice] = []

                for report_notice in report_notices:
                    base_report_path = rdf_path / report_notice.metadata.path
                    notice: Notice = self.generate_notice(
                        notice_id=report_notice.notice.ted_id,
                        base_report_path=base_report_path
                    )
                    sparql_report_notice = self.generate_sparql_report_notice(
                        notice=notice,
                        report_notice=report_notice,
                        base_report_path=base_report_path
                    )
                    if self.is_notice_report:
                        self.validate_notice(report_notice=sparql_report_notice, mapping_suite=mapping_suite,
                                             base_report_path=base_report_path)
                    group_notices.append(sparql_report_notice)

                if group_notices:
                    if self.is_group_report:
                        self.validate_notices(
                            output_path=rdf_path / group_path,
                            label='Group[' + str(group_path) + ']',
                            report=self.sparql_validation_summary_report(
                                report_notices=group_notices,
                                mapping_suite=mapping_suite,
                                metadata=template_metadata
                            )
                        )
                    ms_notices += group_notices

            if ms_notices:
                if self.is_mapping_suite_report:
                    self.validate_notices(
                        output_path=rdf_path,
                        label='MappingSuite[' + mapping_suite_id + ']',
                        report=self.sparql_validation_summary_report(
                            report_notices=ms_notices,
                            mapping_suite=mapping_suite,
                            metadata=template_metadata
                        )
                    )
                if self.is_for_inner_packages:
                    overall_report = self.sparql_validation_summary_report(
                        report_notices=ms_notices,
                        mapping_suite=mapping_suite,
                        report=overall_report,
                        metadata=template_metadata
                    )
                    notices += ms_notices
        if self.is_for_inner_packages and notices:
            self.validate_notices(
                output_path=self.get_output_path(),
                label='Overall[' + ", ".join(self.mapping_suite_ids) + ']',
                report=overall_report
            )

    def run_cmd(self):
        super().run_cmd()

        error = None
        try:
            self.generate_reports()
        except Exception as e:
            error = e
        return self.run_cmd_result(error)


def run(mapping_suite_id=None, ms_id=None, notice_id=None, opt_mappings_folder=DEFAULT_MAPPINGS_PATH, output=".",
        only_inner_overall=False):
    cmd = CmdRunner(
        mapping_suite_ids=[mapping_suite_id] if mapping_suite_id else list(ms_id),
        notice_ids=list(notice_id or []),
        mappings_path=opt_mappings_folder,
        output=output,
        only_inner_overall=only_inner_overall
    )
    cmd.run()


@click.command()
@click.argument('mapping-suite-id', nargs=1, required=False)
@click.option('-ms-id', '--ms-id', required=False, multiple=True, default=None)
@click.option('--notice-id', required=False, multiple=True, default=None)
@click.option('-m', '--opt-mappings-folder', default=DEFAULT_MAPPINGS_PATH)
@click.option('-o', '--output', default=".")
@click.option('-ioa', '--only-inner-overall', required=False, default=False, type=click.BOOL)
def main(mapping_suite_id, ms_id, notice_id, opt_mappings_folder, output, only_inner_overall):
    """
    Generates SPARQL Validation Reports for RDF files
    """
    run(mapping_suite_id, ms_id, notice_id, opt_mappings_folder, output, only_inner_overall)


if __name__ == '__main__':
    main()
