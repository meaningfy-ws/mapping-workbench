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


def json_streamer(data):
    # If data is a dict, stream as a single JSON object
    # If data is a list, stream as a JSON array
    yield '{'
    first = True
    for key, value in data.items():
        if not first:
            yield ','
        else:
            first = False
        yield json.dumps(key)
        yield ':'
        yield json.dumps(value)  # For very large values, you may want to further chunk this
    yield '}'