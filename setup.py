#!/usr/bin/env python

from distutils.core import setup

setup(name='mapping_workbench',
      description='Mapping Workbench',
      author='Meaningfy',
      author_email='eugen@meaningfy.ws',
      url='https://github.com/meaningfy-ws/mapping-workbench',
      packages=[
          'mapping_workbench.app',
          'mapping_workbench.core',
          'mapping_workbench.toolchain'
      ],
      package_dir={
          'mapping_workbench.app': 'mapping_workbench/app',
          'mapping_workbench.core': 'mapping_workbench/core',
          'mapping_workbench.toolchain': 'mapping_workbench/toolchain'
      },
      )
