#!/usr/bin/env python

from distutils.core import setup

PKG_NAMESPACE = "mapping_workbench.app"
PKG_NAME = "mapping_workbench.app"
PKG_VERSION = "0.0.1"
PKG_DESCRIPTION = "Mapping Workbench Toolchain"

setup(name=PKG_NAME,
      description='Mapping Workbench App',
      author='Meaningfy',
      author_email='eugen@meaningfy.ws',
      url='https://github.com/meaningfy-ws/mapping-workbench/tree/main/mapping_workbench/app',
      packages=[
          'mapping_workbench.app'
      ],
      package_dir={
          'mapping_workbench.app': '.'
      },
      namespace_packages=[
          'mapping_workbench.app'
      ],
      )
