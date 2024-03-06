import {useState} from "react";

import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import SparqlValidationReport from "./sparql_validation_report_package_state";
import CoverageFiles from "../xpath_validation_report/coverage_files";
import SparqlTestDatasetReport from "./sparql_validation_report_test_dataset";
import SparqlFileReport from "./sparql_validation_report_file";

const pacakageState = "package_state", testDataset = "test_dataset", fileCoverage =  "file_coverage";

const tabs = [
    {label: 'Package State SPARQL Coverage', value: pacakageState},
    {label: 'Test Dataset SPARQL Coverage', value: testDataset},
    {label: 'File SPARQL Coverage', value: fileCoverage},
];

const SparqlValidationReportView = ({ sid, reportTree }) => {

    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(reportTree.test_data_suites[0].test_data_states[0])
    const [currentTab, setCurrentTab] = useState(tabs[0].value)

    const handleSetPackageState = (file) => {
        setSelectedPackageState(file)
        setCurrentTab(testDataset)
    }

    const handleSetTestDataset = (file) => {
        setSelectedTestDataset(file)
        setCurrentTab(fileCoverage)
    }

    return (
        <>
            <Stack spacing={1}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon/>}>
                    <Link component="button"
                          color={currentTab !== pacakageState ? "inherit" : "primary"}
                          onClick={()=> setCurrentTab(pacakageState)}
                    >
                        Package State SPARQL Coverage
                    </Link>
                    {currentTab !== pacakageState &&
                        <Link component="button"
                              color={currentTab !== testDataset ? "inherit" : "primary"}
                              onClick={() => setCurrentTab(testDataset)}
                        >
                            Test Dataset SPARQL Coverage: {selectedPackageState.identifier}
                        </Link>}
                    {currentTab === fileCoverage &&
                        <Typography color="primary">
                            File SPARQL Coverage: {selectedTestDataset.identifier}
                        </Typography>}
                </Breadcrumbs>
            </Stack>
            {currentTab === pacakageState &&
                <>
                    <CoverageFiles files={reportTree.test_data_suites}
                                   onClick={handleSetPackageState}/>
                    <SparqlValidationReport sid={sid}
                                    files={reportTree.test_data_suites}/>
                </>
            }
            {currentTab === testDataset &&
                <>
                    <CoverageFiles files={selectedPackageState?.test_data_states}
                                   onClick={handleSetTestDataset}/>
                    <SparqlTestDatasetReport sid={sid}
                                        suiteId={selectedPackageState.oid}/>
                </>
            }
            {currentTab === fileCoverage &&
                <SparqlFileReport sid={sid}
                                  suiteId={selectedPackageState.oid}
                                  testId={selectedTestDataset.oid}/>
            }
        </>
    )
}

export default SparqlValidationReportView