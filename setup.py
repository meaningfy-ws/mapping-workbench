#!/usr/bin/python3

# __init__.py
# Date:  07/02/2022
# Author: Eugeniu Costetchi
# Email: costezki.eugen@gmail.com
# Package PIP install location: https://github.com/meaningfy-ws/mapping-workbench/archive/main.zip
""" """

import codecs
import os
import pathlib
import re

from pkg_resources import parse_requirements
from setuptools import setup, find_packages

kwargs = {}
#
with pathlib.Path('requirements.txt').open() as requirements:
      kwargs["install_requires"] = [str(requirement) for requirement in parse_requirements(requirements)]

kwargs["tests_require"] = []
kwargs["extras_require"] = {}

def find_version(filename):
    _version_re = re.compile(r'__version__ = "(.*)"')
    for line in open(filename):
        version_match = _version_re.match(line)
        if version_match:
            return version_match.group(1)


def open_local(paths, mode="r", encoding="utf8"):
    path = os.path.join(os.path.abspath(os.path.dirname(__file__)), *paths)
    return codecs.open(path, mode, encoding)


with open_local(["README.md"], encoding="utf-8") as readme:
    long_description = readme.read()

version = find_version("mapping_workbench/__init__.py")

packages = find_packages(exclude=("examples*", "tests*", "infra*"))


CONSOLE_SCRIPTS_PATH = "mapping_workbench.workbench_tools"

setup(
    name="mapping_workbench",
    version=version,
    description="Mapping Workbench is an awesome system",
    author="Meaningfy",
    author_email="eugen@meaningfy.ws",
    maintainer="Meaningfy Team",
    maintainer_email="ted-sws@meaningfy.ws",
    url="https://github.com/meaningfy-ws/mapping-workbench",
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
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=packages,
    entry_points={
        "console_scripts": [
            f"resources_injector = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_resources_injector:main",
            f"rml_modules_injector = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_rml_modules_injector:main",
            f"sparql_generator = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_sparql_generator:main",
            f"rml_report_generator = {CONSOLE_SCRIPTS_PATH}.rml_to_html.entrypoints.cli.cmd_rml_report_generator:main",
            f"mapping_runner = {CONSOLE_SCRIPTS_PATH}.notice_transformer.entrypoints.cli.cmd_mapping_runner:main",
            f"xpath_coverage_runner = {CONSOLE_SCRIPTS_PATH}.notice_validator.entrypoints.cli.cmd_xpath_coverage_runner:main",
            f"sparql_runner = {CONSOLE_SCRIPTS_PATH}.notice_validator.entrypoints.cli.cmd_sparql_runner:main",
            f"shacl_runner = {CONSOLE_SCRIPTS_PATH}.notice_validator.entrypoints.cli.cmd_shacl_runner:main",
            f"validation_summary_runner = {CONSOLE_SCRIPTS_PATH}.notice_validator.entrypoints.cli.cmd_validation_summary_runner:main",
            f"triple_store_loader = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_triple_store_loader:main",
            f"mapping_suite_validator = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_mapping_suite_validator:main",
            f"metadata_generator = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_metadata_generator:main",
            f"conceptual_mapping_differ = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_conceptual_mapping_differ:main",
            f"rdf_differ = {CONSOLE_SCRIPTS_PATH}.rdf_differ.entrypoints.cli.cmd_rdf_differ:main",
            f"mapping_suite_processor = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_mapping_suite_processor:main",
            f"yarrrml2rml_converter = {CONSOLE_SCRIPTS_PATH}.mapping_suite_processor.entrypoints.cli.cmd_yarrrml2rml_converter:main",
            f"normalisation_resource_generator = {CONSOLE_SCRIPTS_PATH}.data_manager.entrypoints.cli.cmd_generate_mapping_resources:main",
            f"s3_rdf_publisher = {CONSOLE_SCRIPTS_PATH}.notice_publisher.entrypoints.cli.cmd_s3_rdf_publisher:main",
            f"bulk_packager = {CONSOLE_SCRIPTS_PATH}.notice_packager.entrypoints.cli.cmd_bulk_packager:main",
            f"api-digest_service-start-server = ted_sws.notice_transformer.entrypoints.api.digest_service.server:api_server_start",
            f"rdf_component_detector = {CONSOLE_SCRIPTS_PATH}.rdf_component_detector.entrypoints.cli.cmd_rdf_component_detector:main",
            f"export_notices_from_mongodb = {CONSOLE_SCRIPTS_PATH}.data_manager.entrypoints.cli.cmd_export_notices_from_mongodb:main",
            f"shacl_summary_generator = {CONSOLE_SCRIPTS_PATH}.shacl_summary.cli.cmd_shacl_summary_generator:main"
        ],
    },
    include_package_data=True,
    **kwargs,
)
