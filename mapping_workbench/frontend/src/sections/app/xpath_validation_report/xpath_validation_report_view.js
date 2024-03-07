import {useState} from "react";

import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import CoverageFiles from "./coverage_files";
import Typography from "@mui/material/Typography";

import XpathValidationReport from "./xpath_validation_report_package_state";
import XpathValidationReportSuite from "./xpath_validation_report_test_dataset";
import XpathValidationReportTest from "./xpath_validation_report_file";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CoverageReport from "./coverage_report";


const pacakageState = "package_state", testDataset = "test_dataset", fileCoverage =  "file";

const tabs = [
    {label: 'Package State XPath Coverage', value: pacakageState},
    {label: 'Test Dataset XPath Coverage', value: testDataset},
    {label: 'File XPath Coverage', value: fileCoverage},
];

const XpathValidationReportView = ({ sid, reportTree }) => {
    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(reportTree.test_data_suites[0].test_data_states[0])
    const [currentTab, setCurrentTab] = useState(tabs[0].value)
    // const handleDataSuiteChange = (e) => {
    //     const dataSuite = reportTree?.test_data_suites?.find(suite => suite.oid === e.target.value)
    //     setSelectedPackageState(dataSuite);
    //     setSelectedTestDataset(dataSuite.test_data_states[0])
    // }

    // const handleDataStateChange = (e) => {
    //     setSelectedPackageState(selectedPackageState?.test_data_states?.find(state => state.oid === e.target.value))
    // }

    // const handleTabsChange = (event, value) => {
    //     setCurrentTab(value)
    // }
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
                        Package State XPath Coverage
                    </Link>
                    {currentTab !== pacakageState &&
                        <Link component="button"
                              color={currentTab !== testDataset ? "inherit" : "primary"}
                              onClick={() => setCurrentTab(testDataset)}
                        >
                            Package State XPath Coverage: {selectedPackageState.identifier}
                        </Link>}
                    {currentTab === fileCoverage &&
                        <Typography>
                            File XPath Coverage: {selectedTestDataset.identifier}
                        </Typography>}
                </Breadcrumbs>
            </Stack>
            {currentTab === pacakageState &&
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