import re


def sanitize_filename(name: str) -> str:
    # Replace any character that is not alphanumeric, dash, or underscore with an underscore
    return re.sub(r'[^A-Za-z0-9_\-.]', '-', name).lower()