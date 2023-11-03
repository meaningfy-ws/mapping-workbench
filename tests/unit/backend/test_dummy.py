def test_dummy(eforms_fields_file_path, eforms_fields):
    assert eforms_fields_file_path.exists()
    assert eforms_fields is not None
    assert isinstance(eforms_fields, dict)


def test_fields_importer(eforms_fields):
    print(eforms_fields.keys())


def test_fields_importer(eforms)