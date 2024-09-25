import {useState} from "react";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import CoverageFiles from "./coverage_files";
import ShaclFileReport from "./shacl_validation_report_file";
import ShaclTestDatasetReport from "./shacl_validation_report_test_dataset";
import ShaclPackageStateReport from "./shacl_validation_report_package_state";

const PACKAGE_STATE = "package_state";
const PACKAGE_STATE_LABEL = "Package State SHACL Coverage";
const TEST_DATASET = "test_dataset";
const TEST_DATASET_LABEL = "Test Dataset SHACL Coverage";
const FILE_COVERAGE = "file_coverage";
const FILE_COVERAGE_LABEL = "File SHACL Coverage"

const ShaclValidationReportView = ({sid, reportTree}) => {

    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(selectedPackageState.test_data_states[0])
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
                <Breadcrumbs separator={<ChevronRightIcon/>}>
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
                    <ShaclPackageStateReport sid={sid}
                                             handleSelectFile={handleSetTestAndPackage}
                                             files={reportTree.test_data_suites}/>
                </>
            }
            {currentTab === TEST_DATASET &&
                <>
                    <CoverageFiles files={selectedPackageState?.test_data_states}
                                   onClick={handleSetTestDataset}
                                   fileIcon/>
                    <ShaclTestDatasetReport sid={sid}
                                            handleSelectFile={handleSetTestAndPackage}
                                            suiteId={selectedPackageState.oid}/>
                </>
            }
            {currentTab === FILE_COVERAGE &&
                <ShaclFileReport sid={sid}
                                 suiteId={selectedPackageState.oid}
                                 testId={selectedTestDataset.oid}/>
            }
        </>
    )
}

export default ShaclValidationReportView