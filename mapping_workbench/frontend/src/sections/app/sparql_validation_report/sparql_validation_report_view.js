import {useState} from "react";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import CoverageFiles from "./coverage_files";
import SparqlFileReport from "./sparql_validation_report_file";
import SparqlTestDatasetReport from "./sparql_validation_report_test_dataset";
import SparqlPackageStateReport from "./sparql_validation_report_package_state";

const PACKAGE_STATE = "package_state";
const PACKAGE_STATE_LABEL = "Package State SPARQL Coverage";
const TEST_DATASET = "test_dataset";
const TEST_DATASET_LABEL = "Test Dataset SPARQL Coverage";
const FILE_COVERAGE = "file_coverage";
const FILE_COVERAGE_LABEL = "File SPARQL Coverage"

const SparqlValidationReportView = ({sid, reportTree}) => {

    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(reportTree.test_data_suites[0].test_data_states[0])
    const [currentTab, setCurrentTab] = useState(PACKAGE_STATE)

    const handleSetPackageState = (file) => {
        setSelectedPackageState(file)
        setCurrentTab(TEST_DATASET)
    }

    const handleSetTestDataset = (file) => {
        setSelectedTestDataset(file)
        setCurrentTab(FILE_COVERAGE)
    }

    const handleSetTestAndPackage = (testData, testDataSuite) => {
        const packageState = reportTree.test_data_suites.find(tds => tds.oid === testDataSuite)
        setSelectedTestDataset(packageState?.test_data_states.find(ps => ps.oid === testData));
        setSelectedPackageState(packageState);
        setCurrentTab(FILE_COVERAGE)
    }

    return (
        <>
            <Stack spacing={1}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon/>}>
                    <Link component="button"
                          color={currentTab !== PACKAGE_STATE ? "inherit" : "primary"}
                          onClick={() => setCurrentTab(PACKAGE_STATE)}
                    >
                        {PACKAGE_STATE_LABEL}
                    </Link>
                    {currentTab !== PACKAGE_STATE &&
                        <Link component="button"
                              color={currentTab !== TEST_DATASET ? "inherit" : "primary"}
                              onClick={() => setCurrentTab(TEST_DATASET)}
                        >
                            {TEST_DATASET_LABEL}: {<b>{selectedPackageState.identifier}</b>}
                        </Link>}
                    {currentTab === FILE_COVERAGE &&
                        <Typography color="primary">
                            {FILE_COVERAGE_LABEL}: {<b>{selectedTestDataset.identifier}</b>}
                        </Typography>}
                </Breadcrumbs>
            </Stack>
            {currentTab === PACKAGE_STATE &&
                <>
                    <CoverageFiles files={reportTree.test_data_suites}
                                   onClick={handleSetPackageState}/>
                    <SparqlPackageStateReport sid={sid}
                                              handleSelectFile={handleSetTestAndPackage}
                                              files={reportTree.test_data_suites}/>
                </>
            }
            {currentTab === TEST_DATASET &&
                <>
                    <CoverageFiles files={selectedPackageState?.test_data_states}
                                   onClick={handleSetTestDataset}
                                   fileIcon/>
                    <SparqlTestDatasetReport sid={sid}
                                             handleSelectFile={handleSetTestAndPackage}
                                             suiteId={selectedPackageState.oid}/>
                </>
            }
            {currentTab === FILE_COVERAGE &&
                <SparqlFileReport sid={sid}
                                  suiteId={selectedPackageState.oid}
                                  testId={selectedTestDataset.oid}/>
            }
        </>
    )
}

export default SparqlValidationReportView