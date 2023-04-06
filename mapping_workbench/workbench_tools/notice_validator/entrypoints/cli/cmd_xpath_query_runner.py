import json
from pathlib import Path
from typing import List

import click
from ted_sws.core.adapters.cmd_runner import CmdRunnerForMappingSuite as BaseCmdRunner, DEFAULT_MAPPINGS_PATH
from ted_sws.core.model.manifestation import XMLManifestation
from ted_sws.core.model.notice import Notice
from ted_sws.core.model.transform import MappingSuite
from ted_sws.core.model.validation_report import ReportNotice, ReportNoticeMetadata
from ted_sws.data_manager.adapters.mapping_suite_repository import MappingSuiteRepositoryInFileSystem
from ted_sws.data_manager.services.mapping_suite_resource_manager import file_resource_path, file_resource_output_path
from ted_sws.event_manager.adapters.log import LOG_INFO_TEXT

from mapping_workbench.workbench_tools.mapping_suite_processor import OUTPUT_FOLDER, DEFAULT_TEST_SUITE_REPORT_FOLDER
from mapping_workbench.workbench_tools.notice_validator.services.xpath_query import \
    generate_xpaths_queries_for_notice_report

REPORT_FILE = "xpath_query_validation"
XPATH_QUERY_JSON_REPORT_FILE = REPORT_FILE + ".json"
CMD_NAME = "CMD_XPATH_QUERY_RUNNER"


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by XPATH Query Runner
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

    def get_mapping_suite(self, mapping_suite_id) -> MappingSuite:
        repository_path = Path(self.mappings_path)
        mapping_suite_repository = MappingSuiteRepositoryInFileSystem(repository_path=repository_path)
        return mapping_suite_repository.get(reference=mapping_suite_id)

    @classmethod
    def save_report(cls, report_path, report_name, content):
        with open(report_path / report_name, "w+") as f:
            f.write(content)

    def run_cmd(self):
        super().run_cmd()

        mapping_suite: MappingSuite = self.get_mapping_suite(self.mapping_suite_id)
        xpaths = mapping_suite.conceptual_mapping.xpaths
        output_path = Path(self.output_folder)
        notice: Notice
        for notice_resource in mapping_suite.transformation_test_data.test_data:
            notice_id = Path(notice_resource.file_name).stem
            self.log("Querying " + LOG_INFO_TEXT.format(f"Notice[{notice_id}]") + " ... ")
            notice = Notice(ted_id=notice_id)
            notice.set_xml_manifestation(xml_manifestation=XMLManifestation(
                object_data=notice_resource.file_content
            ))
            report_notice = ReportNotice(notice=notice,
                                         metadata=ReportNoticeMetadata(path=file_resource_path(notice_resource)))
            report = generate_xpaths_queries_for_notice_report(xpaths, report_notice)
            base_report_path = file_resource_output_path(notice_resource,
                                                         output_path) / notice_id / DEFAULT_TEST_SUITE_REPORT_FOLDER
            base_report_path.mkdir(parents=True, exist_ok=True)
            self.save_report(base_report_path, XPATH_QUERY_JSON_REPORT_FILE,
                             json.dumps(report.dict(), sort_keys=True, indent=4))

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
    Generates XPATH Query Reports for Notices
    """
    run(mapping_suite_id, notice_id, opt_mappings_folder)


if __name__ == '__main__':
    main()
