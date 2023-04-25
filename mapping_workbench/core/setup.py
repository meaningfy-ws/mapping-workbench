#!/usr/bin/python3

""" """

__version__ = "0.0.1"

import pathlib
import re

from pkg_resources import parse_requirements
from setuptools import setup, find_packages

kwargs = {}

with pathlib.Path('requirements.txt').open() as requirements:
    kwargs["install_requires"] = [str(requirement) for requirement in parse_requirements(requirements)]

kwargs["extras_require"] = {}

PACKAGE_DIR = 'src'
NAME = "mapping_workbench.core"
DESCRIPTION = "Mapping Workbench Core"
LONG_DESCRIPTION = pathlib.Path("README.md").read_text(encoding="utf-8")
URL = "https://github.com/meaningfy-ws/mapping-workbench/tree/main/mapping_workbench/core"

SOURCE_PACKAGE_REGEX = re.compile(rf'^{PACKAGE_DIR}')
source_packages = find_packages(include=[PACKAGE_DIR, f'{PACKAGE_DIR}.*'])
PACKAGES = [SOURCE_PACKAGE_REGEX.sub(NAME, name) for name in source_packages]

setup(
    name=NAME,
    version=__version__,
    description=DESCRIPTION,
    author="Meaningfy",
    author_email="eugen@meaningfy.ws",
    maintainer="Meaningfy Team",
    maintainer_email="ted-sws@meaningfy.ws",
    url=URL,
    license="Apache License 2.0",
    platforms=["any"],
    python_requires=">=3.7",
    classifiers=[
        "Intended Audience :: Developers",
        "Intended Audience :: System Administrators",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Natural Language :: English",
    ],
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    packages=PACKAGES,
    package_dir={NAME: PACKAGE_DIR},
    include_package_data=True,
    tests_require=['pytest'],
    **kwargs,
)
