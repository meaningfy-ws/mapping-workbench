from pydantic import ConfigDict

DEFAULT_MODEL_CONFIG = ConfigDict(extra='forbid',
                                  strict=True)

STRICT_MODEL_CONFIG = ConfigDict(extra='forbid',
                                  strict=True,
                                  validate_assignment=True,
                                  revalidate_instances='always',
                                  validate_default=True,
                                  validate_return=True)