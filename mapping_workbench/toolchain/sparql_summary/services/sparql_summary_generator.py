import json
import pathlib
from typing import List, Tuple
import json, os
import hashlib


def process_sparql_json(error_list: List):
    listError, finalHash, issueHash = [], {}, {}
    for name in error_list:

        for issue in name[0][0]['validation_results']:
            if issue['result'] in ['warning', 'error', 'unverifiable', 'invalid']:
                if issueHash.get(issue['result']) == None:
                    issueHash.setdefault(issue['result'], []).append((str(name[1]) + "*" + str(issue['identifier']),
                                                                      issue['query']['title'], issue['query']['xpath'],
                                                                      issue['query']['query']))
                else:
                    issueHash[issue['result']].append((str(name[1]) + "*" + str(issue['identifier']),
                                                       issue['query']['title'], issue['query']['xpath'],
                                                       issue['query']['query']))
            listError.append(
                (str(issue['identifier']), issue['query']['title'], issue['query']['xpath'], issue['query']['query']))

    for query in issueHash:
        helperHash = {}
        for result in issueHash[query]:
            helper = result[0].split("*")
            if helperHash.get(str(helper[1])) == None:
                helperHash.setdefault(str(helper[1]), []).append(helper[0].replace(".json", ""))
            else:
                helperHash[str(helper[1])].append(helper[0].replace(".json", ""))

        secondHash = {}
        for k in helperHash:
            for l in listError:
                if k == l[0]:
                    helper = [i.replace("/TED_EXPORT/FORM_SECTION/F", "") for i in l[2]]

                    hash_object = hashlib.md5((str(l[3]) + str(helper) + str(l[1])).encode())
                    secondHash[l[0]] = {"notices": helperHash[k], "notice_count": len(helperHash[k]),
                                        "details": {"title": l[1], "query": l[3], "xpath": l[2],
                                                    "issue_code": "issue_" + hash_object.hexdigest()}}

        secondHash["count"] = len(secondHash)

        if finalHash.get(query) == None:
            finalHash.setdefault(query, []).append(secondHash)
        else:
            finalHash[query].append(secondHash)

    return finalHash


def read_metadata(data):
    listProblem = []
    for name in data:
        for error in data[name]:
            for o in data[name][error]:
                for sparql in o:
                    if sparql != "count":
                        listProblem.append((error, o[sparql]['details']['issue_code'], name,
                                            o[sparql]['details']['title'], o[sparql]['details']['xpath'],
                                            o[sparql]['details']['query']))

    return listProblem


def process_sparql_summary(listProblem):
    errorHash, listHelper = {}, []
    for error in listProblem:
        if errorHash.get(str(error[0]) + "**" + str(error[1])) == None:
            errorHash.setdefault(str(error[0]) + "**" + str(error[1]), []).append(error[2])
        else:
            errorHash[str(error[0]) + "**" + str(error[1])].append(error[2])
        listHelper.append((error[1], error[3], error[4], error[5]))

    # using set
    visited = set()

    # Output list initialization
    Output = []

    # Iteration
    for a, b, c, d in listHelper:
        if not a in visited:
            visited.add(a)
            Output.append((a, b, c, d))

    helperHash = {}
    for e in errorHash:
        eNew = e.split("**")
        helper = [i.replace("sparqlValidation", "package_").replace(".json", "") for i in errorHash[e]]
        title, path = "", []
        for h in Output:
            if eNew[1] == h[0]:
                title = h[1]
                path = h[2]
                query = h[3]
        helperHash[e] = {"packages": helper, "details": {"title": title, "xpath": path, "query": query}}

    # print(helperHash)
    finalHash, done = {}, {}
    for e in helperHash:
        eNew = e.split("**")
        if done.get(eNew[0]) == None:
            done.setdefault(eNew[0], []).append({eNew[1]: helperHash[e]})
        else:
            done[eNew[0]].append({eNew[1]: helperHash[e]})

    for e in done:
        # print(len(done[e]))
        done[e] = {"count": len(done[e]), "queries": done[e]}

    return done


def generate_sparql_summary(packages_dir_path: pathlib.Path) -> dict:
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
                            id = notice_path
                            sparql_validation_path = notice_path / "test_suite_report" / "sparql_validations.json"
                            if sparql_validation_path.exists() and sparql_validation_path.is_file():
                                sparql_validation_content = sparql_validation_path.read_text(encoding="utf-8")
                                sparql_validation_content = json.loads(sparql_validation_content)
                                packages_list_of_errors.append(
                                    (sparql_validation_content, str(id).split("/output/")[1]))
                    errors_per_package[package_path.name] = process_sparql_json(packages_list_of_errors)
                    if errors_per_package[package_path.name]:
                        package_sparql_summary_file_path = notices_output_path / "sparql_summary_validation.json"
                        package_sparql_summary_file_path.write_text(json.dumps(errors_per_package[package_path.name]),
                                                                    encoding="utf-8"
                                                                    )
        listProblem = read_metadata(errors_per_package)
        finalHash = process_sparql_summary(listProblem)
        packages_shacl_summary_file_path = packages_dir_path / "packages_sparql_summary_validation.json"
        packages_shacl_summary_file_path.write_text(json.dumps(finalHash), encoding="utf-8")
        return finalHash
    else:
        raise Exception("Invalid packages dir path!")
