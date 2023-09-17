#!/usr/bin/python3

""" """

__version__ = "0.1.0"

import pathlib

from pkg_resources import parse_requirements
from setuptools import setup, find_packages

AUTHOR = "Meaningfy"
AUTHOR_EMAIL = "eugen@meaningfy.ws"
MAINTAINER = "Meaningfy Team"
MAINTAINER_EMAIL = "ted-sws@meaningfy.ws"
LICENSE = "Apache License 2.0"

PACKAGE_DIR = 'mapping_workbench'
NAME = "mapping_workbench"
DESCRIPTION = "Mapping Workbench"
LONG_DESCRIPTION = pathlib.Path("README.md").read_text(encoding="utf-8")
URL = "https://github.com/meaningfy-ws/mapping-workbench"
TOOLCHAIN_PACKAGE = f"{NAME}.toolchain"

PACKAGES = find_packages(include=[PACKAGE_DIR, f"{PACKAGE_DIR}.*"])

CLASSIFIERS = [
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
]

kwargs = {}

with pathlib.Path('requirements.toolchain.txt').open() as requirements:
    kwargs["install_requires"] = [str(requirement) for requirement in parse_requirements(requirements)]

kwargs["extras_require"] = {}

setup(
    name=NAME,
    version=__version__,
    description=DESCRIPTION,
    author=AUTHOR,
    author_email=AUTHOR_EMAIL,
    maintainer=MAINTAINER,
    maintainer_email=MAINTAINER_EMAIL,
    url=URL,
    license=LICENSE,
    platforms=["any"],
    python_requires=">=3.7",
    classifiers=CLASSIFIERS,
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    packages=PACKAGES,
    package_dir={
        NAME: PACKAGE_DIR
    },
    entry_points={
        "console_scripts": [],
    },
    include_package_data=True,
    tests_require=['pytest'],
    **kwargs,
)
