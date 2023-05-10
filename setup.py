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

CONSOLE_SCRIPTS = [
    f"resources_injector = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_resources_injector:main",
    f"rml_modules_injector = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_rml_modules_injector:main",
    f"sparql_queries_injector = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_sparql_queries_injector:main",
    f"sparql_generator = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_sparql_generator:main",
    f"rml_report_generator = {TOOLCHAIN_PACKAGE}.rml_to_html.entrypoints.cli.cmd_rml_report_generator:main",
    f"mapping_runner = {TOOLCHAIN_PACKAGE}.notice_transformer.entrypoints.cli.cmd_mapping_runner:main",
    f"xpath_coverage_runner = {TOOLCHAIN_PACKAGE}.notice_validator.entrypoints.cli.cmd_xpath_coverage_runner:main",
    f"xpath_query_runner = {TOOLCHAIN_PACKAGE}.notice_validator.entrypoints.cli.cmd_xpath_query_runner:main",
    f"sparql_runner = {TOOLCHAIN_PACKAGE}.notice_validator.entrypoints.cli.cmd_sparql_runner:main",
    f"shacl_runner = {TOOLCHAIN_PACKAGE}.notice_validator.entrypoints.cli.cmd_shacl_runner:main",
    f"validation_summary_runner = {TOOLCHAIN_PACKAGE}.notice_validator.entrypoints.cli.cmd_validation_summary_runner:main",
    f"triple_store_loader = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_triple_store_loader:main",
    f"mapping_suite_validator = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_mapping_suite_validator:main",
    f"metadata_generator = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_metadata_generator:main",
    f"conceptual_mapping_differ = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_conceptual_mapping_differ:main",
    f"rdf_differ = {TOOLCHAIN_PACKAGE}.rdf_differ.entrypoints.cli.cmd_rdf_differ:main",
    f"mapping_suite_processor = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_mapping_suite_processor:main",
    f"yarrrml2rml_converter = {TOOLCHAIN_PACKAGE}.mapping_suite_processor.entrypoints.cli.cmd_yarrrml2rml_converter:main",
    f"normalisation_resource_generator = {TOOLCHAIN_PACKAGE}.data_manager.entrypoints.cli.cmd_generate_mapping_resources:main",
    f"s3_rdf_publisher = {TOOLCHAIN_PACKAGE}.notice_publisher.entrypoints.cli.cmd_s3_rdf_publisher:main",
    f"bulk_packager = {TOOLCHAIN_PACKAGE}.notice_packager.entrypoints.cli.cmd_bulk_packager:main",
    f"rdf_component_detector = {TOOLCHAIN_PACKAGE}.rdf_component_detector.entrypoints.cli.cmd_rdf_component_detector:main",
    f"export_notices_from_mongodb = {TOOLCHAIN_PACKAGE}.data_manager.entrypoints.cli.cmd_export_notices_from_mongodb:main",
    f"shacl_summary_generator = {TOOLCHAIN_PACKAGE}.shacl_summary.entrypoints.cli.cmd_shacl_summary_generator:main",
    f"sparql_summary_generator = {TOOLCHAIN_PACKAGE}.sparql_summary.entrypoints.cli.cmd_sparql_summary_generator:main"
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
        "console_scripts": CONSOLE_SCRIPTS,
    },
    include_package_data=True,
    tests_require=['pytest'],
    **kwargs,
)
