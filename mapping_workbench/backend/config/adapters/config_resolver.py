#!/usr/bin/python3

# config_resolver.py
# Date:  01/07/2021

"""
    This module aims to provide a simple method of resolving configurations,
    through the process of searching for them in different sources.
"""
import inspect
import logging
import os
from abc import ABC, abstractmethod
from typing import Type

logger = logging.getLogger(__name__)


class ConfigResolverABC(ABC):
    """
        This class defines a configuration resolution abstraction.
    """

    def config_resolve(self, config_key: str = None, default_value: str = None) -> str:
        """
            This method aims to search for a configuration and return its value.
        :param config_key: the name of the configuration you are looking for
        :param default_value: the default return value, if the configuration is not found.
        :return: the value of the search configuration if found, otherwise default_value returns
        """
        if config_key is None:
            config_key = inspect.stack()[1][3]
        return self.concrete_config_resolve(config_key, default_value)

    @abstractmethod
    def concrete_config_resolve(self, config_name: str, default_value: str = None):
        """
            This abstract method is used to be able to define the configuration search in different environments.
        :param config_name: the name of the configuration you are looking for
        :param default_value: the default return value, if the configuration is not found.
        :return: the value of the search configuration if found, otherwise default_value returns
        """
        raise NotImplementedError


class EnvConfigResolver(ConfigResolverABC):
    """
        This class aims to search for configurations in environment variables.
    """

    def concrete_config_resolve(self, config_name: str, default_value: str = None):
        value = os.environ.get(config_name, default=default_value)
        logger.debug("[ENV] Value of '" + str(config_name) + "' is " + str(value) + "(supplied default is '" + str(
            default_value) + "')")
        return value


def env_property(config_resolver_class: Type[ConfigResolverABC] = EnvConfigResolver,
                 config_key: str = None,
                 default_value: str = None):
    """
        This function provide decorator mechanism for config resolver.
    :param config_resolver_class:
    :param config_key:
    :param default_value:
    :return:
    """

    def wrap(func):
        @property
        def wrapped_function(self, *args, **kwargs):
            config_value = config_resolver_class().concrete_config_resolve(config_name=config_key or func.__name__,
                                                                           default_value=default_value)
            return func(self, config_value, *args, **kwargs)

        return wrapped_function

    return wrap
