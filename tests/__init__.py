import os
import pathlib

from ted_sws import RUN_ENV_NAME, RUN_TEST_ENV_VAL

os.environ[RUN_ENV_NAME] = RUN_TEST_ENV_VAL

TESTS_PATH = pathlib.Path(__file__).parent.resolve()

TEST_DATA_PATH = TESTS_PATH / 'test_data'
