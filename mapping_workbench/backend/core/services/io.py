import hashlib
import re


def sanitize_filename(name: str) -> str:
    # Replace any character that is not alphanumeric, dash, or underscore with a dash
    return re.sub(r'[^A-Za-z0-9_\-.()]', '-', name).lower()


def unique_hash(*values):
    # Convert all values to string and join with a separator
    joined = '_'.join(str(v) for v in values)
    # Use SHA256 for a stable hash
    return hashlib.sha256(joined.encode('utf-8')).hexdigest()