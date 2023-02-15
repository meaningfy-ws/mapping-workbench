import os, json
from pathlib import Path

def Remove(duplicate):
    final = []
    for num in duplicate:
        if num not in final:
            final.append(num)
    return final

def readFilename(names, number):
    for name in names:
        if "." not in name:
            os.chdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/packages/package_F" + str(number) +  "/output/" + str(name) + "/test_suite_report")
            f = open("shacl_validations.json")
            data = json.load(f)
            newName = name + ".json"
            os.chdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/shaclValidationF" + str(number))
            with open(newName, "w") as outfile:
                json.dump(data, outfile)

    return 1

def readJson(names, formNumber):
    os.chdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/shaclValidationF" + formNumber)

    listError = []
    for name in names:
        f = open(name)
        if "shacl" not in name:
            name = "shacl_violation_" + name
        data = json.load(f)
        for error in data[0]["validation_results"]["results_dict"]["results"]["bindings"]:
            listError.append((error['message']['value'], error['resultPath']['value'], name.split("_")[2].replace(".json", "")))
    return listError

def processError(listError, formNumber):
    errorHash = {}
    for error in listError:
        if "http://data.europa.eu/a4g/ontology#" in str(error[1]):
            k = str(error[1]).replace("http://data.europa.eu/a4g/ontology#", "epo:")
        elif "http://www.w3.org/ns/locn#" in str(error[1]):
            k = str(error[1]).replace("http://www.w3.org/ns/locn#", "locn:")
        if errorHash.get(k) == None:
            if " on " in str(error[1]):
                problem = str(error[0].split(" on ")[0])
            else:
                problem = str(error[0].split(" on ")[0])
            errorHash.setdefault(k, []).append((problem, error[2]))
        else:
            if " on " in str(error[1]):
                problem = str(error[0].split(" on ")[0])
            else:
                problem = str(error[0].split(" on ")[0])
            errorHash[k].append((problem, error[2]))

    finalHash = {}
    for error in errorHash:
        helperHash = {}
        for ent in errorHash[error]:
            if helperHash.get(ent[0]) == None:
                helperHash.setdefault(ent[0], []).append(ent[1])
            else:
                helperHash[ent[0]].append(ent[1])

        for property in helperHash:
            if finalHash.get(error) == None:
                finalHash.setdefault(error, []).append({"message": property, "notices": Remove(helperHash[property]), "notice_count": len(Remove(helperHash[property]))})
            else:
                finalHash[error].append({"message": property, "notices": Remove(helperHash[property]), "notice_count": len(Remove(helperHash[property]))})


    with open("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/shaclMetadata/shaclValidationF" + formNumber + ".json", "w") as outfile:
        json.dump(finalHash, outfile, sort_keys=True, indent=4)

    return 1

def readMetadata(names):
    os.chdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/shaclMetadata")

    listProblem = []
    for name in names:
        f = open(name)
        data = json.load(f)
        for error in data:
            for o in data[error]:
                listProblem.append((error, o["message"], name))


    return listProblem

def processProblem(listProblem):
    errorHash = {}

    for error in listProblem:
        if errorHash.get(str(error[0]) + "**" + str(error[1])) == None:
            errorHash.setdefault(str(error[0]) + "**" + str(error[1]), []).append(error[2])
        else:
            errorHash[str(error[0]) + "**" + str(error[1])].append(error[2])

    finalHash = {}
    for error in errorHash:
        k = error.split("**")
        print(k, errorHash[error])
        helper = [i.replace("shaclValidation", "package_").replace(".json", "") for i in errorHash[error]]
        if finalHash.get(k[0]) == None:
            finalHash.setdefault(k[0], []).append({"message": k[1], "mapping_suits": helper})
        else:
            finalHash[k[0]].append({"message": k[1], "mapping_suits": helper})


    with open("summary.json", "w") as outfile:
        json.dump(finalHash, outfile, sort_keys=True, indent=4)
    return 1

def generate_shacl_summary(some_text: str) -> str:
    formStandar = ["03", "06", "13", "20", "21", "22", "23", "25"]

    for number in formStandar:
        names = os.listdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/packages/package_F" + str(number) + "/output")
        flagRead = readFilename(names, number)
    for formNumber in formStandar:
        names = dir_list = os.listdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/shaclValidationF" + formNumber)
        listError = readJson(names, formNumber)
        flagProcess = processError(listError, formNumber)

    names = os.listdir("/home/valexande/work/repos/mapping-workbench/mapping_workbench/workbench_tools/shacl_summary/services/shaclMetadata")
    listProblem = readMetadata(names)
    print(listProblem)
    listProblem = Remove(listProblem)
    flagProccessed = processProblem(listProblem)

    msg = f"Hey! I received: {some_text}"
    print(msg)
    return flagProccessed
