import pathlib
import tempfile

from mapping_workbench.backend.fields_registry.adapters.github_download import GithubDownloader
from mapping_workbench.backend.fields_registry.services.import_fields_registry import FIELDS_PATH_NAME, \
    FIELDS_JSON_FILE_NAME, NOTICE_TYPES_PATH_NAME

GITHUB_LICENSE_FILE_NAME = "LICENSE"


def test_github_downloader(eforms_sdk_github_repository_url, eforms_sdk_github_repository_v1_9_1_tag_name):
    with tempfile.TemporaryDirectory() as tmp_dir:
        temp_dir_path = pathlib.Path(tmp_dir)
        github_downloader = GithubDownloader(github_repository_url=eforms_sdk_github_repository_url,
                                             branch_or_tag_name=eforms_sdk_github_repository_v1_9_1_tag_name)

        github_downloader.download(result_dir_path=temp_dir_path,
                                   download_resources_filter=[FIELDS_PATH_NAME, NOTICE_TYPES_PATH_NAME,
                                                              GITHUB_LICENSE_FILE_NAME])
        assert (temp_dir_path / FIELDS_PATH_NAME).exists()
        assert (temp_dir_path / FIELDS_PATH_NAME / FIELDS_JSON_FILE_NAME).exists()
        assert (temp_dir_path / NOTICE_TYPES_PATH_NAME).exists()
        assert (temp_dir_path / GITHUB_LICENSE_FILE_NAME).exists()
