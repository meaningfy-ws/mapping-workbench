import {useState} from "react";

import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import CoverageFiles from "./coverage_files";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import XpathValidationReport from "./xpath_validation_report_package_state";
import XpathValidationReportSuite from "./xpath_validation_report_test_dataset";
import XpathValidationReportTest from "./xpath_validation_report_file";

const packageState = "package_state"
const packageStateLabel = "Package State XPath Coverage"
const testDataset = "test_dataset"
const testDatasetLabel = "Test Dataset XPath Coverage"
const fileCoverage =  "file";
const fileCoverageLabel = "File XPath Coverage"

const XpathValidationReportView = ({ sid, reportTree }) => {
    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(reportTree.test_data_suites[0].test_data_states[0])
    const [currentTab, setCurrentTab] = useState(packageState)

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
                          color={currentTab !== packageState ? "inherit" : "primary"}
                          onClick={()=> setCurrentTab(packageState)}
                    >
                        {packageStateLabel}
                    </Link>
                    {currentTab !== packageState &&
                        <Link component="button"
                              color={currentTab !== testDataset ? "inherit" : "primary"}
                              onClick={() => setCurrentTab(testDataset)}
                        >
                            {fileCoverageLabel}: {<b>{selectedPackageState.identifier}</b>}
                        </Link>}
                    {currentTab === fileCoverage &&
                        <Typography color="primary">
                            {testDatasetLabel}: {<b>{selectedTestDataset.identifier}</b>}
                        </Typography>}
                </Breadcrumbs>
            </Stack>
            {currentTab === packageState &&
                <>
                    <CoverageFiles files={reportTree.test_data_suites}
                                   onClick={handleSetPackageState}/>
                    <XpathValidationReport sid={sid}
                                           files={reportTree.test_data_suites}
                                           mappingSuiteIdentifier={reportTree.identifier}/>
                </>
            }
            {currentTab === testDataset &&
                <>
                    <CoverageFiles files={selectedPackageState?.test_data_states}
                                   onClick={handleSetTestDataset}/>
                    <XpathValidationReportSuite sid={sid}
                                        suiteId={selectedPackageState.oid}
                                        files={selectedPackageState?.test_data_states}
                                        mappingSuiteIdentifier={reportTree.identifier}/>
                </>
            }
            {currentTab === fileCoverage &&
                <XpathValidationReportTest sid={sid}
                                       suiteId={selectedPackageState.oid}
                                       testId={selectedTestDataset.oid}
                                       mappingSuiteIdentifier={reportTree.identifier}/>
            }
        </>
    )
}

export default XpathValidationReportView