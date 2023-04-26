import json
import pathlib
from typing import List, Tuple


def clean_uries(input_uri) -> str:
    if "http://data.europa.eu/a4g/ontology#" in str(input_uri):
        input_uri = str(input_uri).replace("http://data.europa.eu/a4g/ontology#", "epo:")
    elif "http://www.w3.org/ns/locn#" in str(input_uri):
        input_uri = str(input_uri).replace("http://www.w3.org/ns/locn#", "locn:")
    return input_uri


def clean_message(message: str) -> str:
    return message.split(" on ")[0]


def process_shacl_error(error_list: List, group_label: str):
    errorHash = {}
    for message, property_uri, notice_id in error_list:
        if property_uri not in errorHash.keys():
            errorHash.setdefault(property_uri, []).append((message, notice_id))
        else:
            errorHash[property_uri].append((message, notice_id))

    finalHash = {}
    for error in errorHash:
        helperHash = {}
        for ent in errorHash[error]:
            if helperHash.get(ent[0]) == None:
                helperHash.setdefault(ent[0], []).append(ent[1])
            else:
                helperHash[ent[0]].append(ent[1])

        for prop in helperHash:
            group_elements = list(set((helperHash[prop])))
            new_item = {"message": prop, group_label: group_elements,
                        f"{group_label}_count": len(group_elements)}

            if error not in finalHash.keys():
                finalHash.setdefault(error, []).append(new_item)
            else:
                finalHash[error].append(new_item)
    return finalHash


def process_packages_errors(list_of_packages_errors: List):
    list_of_packages_errors = list(set(list_of_packages_errors))
    errorHash = {}

    for prop, message, package_id in list_of_packages_errors:
        key = str(prop) + "**" + str(message)
        if key not in errorHash.keys():
            errorHash.setdefault(key, []).append(package_id)
        else:
            errorHash[key].append(package_id)

    finalHash = {}
    for key, package_ids in errorHash.items():
        prop, message = key.split("**")
        new_item = {"message": message, "mapping_suits": package_ids}
        if prop not in finalHash.keys():
            finalHash.setdefault(prop, []).append(new_item)
        else:
            finalHash[prop].append(new_item)

    return finalHash


def extract_shacl_validation_metadata(shacl_validations: list, notice_id: str, package_id: str) -> Tuple[list, list]:
    notice_list_of_errors = []
    package_list_of_errors = []

    for shacl_validation in shacl_validations:
        errors = shacl_validation["validation_results"]["results_dict"]["results"]["bindings"]
        for error in errors:
            property_uri = clean_uries(error['resultPath']['value'])
            error_message = clean_message(error['message']['value'])
            notice_list_of_errors.append((error_message, property_uri, notice_id))
            package_list_of_errors.append((property_uri, error_message, package_id))
    return package_list_of_errors, notice_list_of_errors


def generate_shacl_summary(packages_dir_path: pathlib.Path) -> dict:
    packages = {}
    errors_per_package = {}
    packages_list_of_errors = []
    if packages_dir_path.is_dir():
        for package_path in packages_dir_path.iterdir():
            if package_path.is_dir() and package_path.name.startswith("package_F"):
                packages[package_path.name] = {}
                notices_output_path = package_path / "output"
                if notices_output_path.exists():
                    errors_per_package[package_path.name] = None
                    notices_rdf_files_paths = [path for path in notices_output_path.rglob("*.ttl") if path.is_file()]
                    for notice_rdf_path in notices_rdf_files_paths:
                        notice_path = notice_rdf_path.parent
                        if notice_path.is_dir():
                            shacl_validation_path = notice_path / "test_suite_report" / "shacl_validations.json"
                            if shacl_validation_path.exists() and shacl_validation_path.is_file():
                                shacl_validation_content = shacl_validation_path.read_text(encoding="utf-8")
                                shacl_validation_json = json.loads(shacl_validation_content)
                                package_list_of_errors, notice_list_of_errors = extract_shacl_validation_metadata(
                                    shacl_validation_json,
                                    notice_path.name,
                                    package_path.name
                                )
                                packages_list_of_errors += package_list_of_errors
                                errors_per_package[package_path.name] = process_shacl_error(notice_list_of_errors,
                                                                                            group_label="notices")

                    if errors_per_package[package_path.name]:
                        package_shacl_summary_file_path = notices_output_path / "shacl_summary_validation.json"
                        package_shacl_summary_file_path.write_text(json.dumps(errors_per_package[package_path.name]),
                                                                   encoding="utf-8"
                                                                   )

        summary_result = process_packages_errors(list_of_packages_errors=packages_list_of_errors)
        packages_shacl_summary_file_path = packages_dir_path / "packages_shacl_summary_validation.json"
        packages_shacl_summary_file_path.write_text(json.dumps(summary_result), encoding="utf-8")
        return summary_result
    else:
        raise Exception("Invalid packages dir path!")

