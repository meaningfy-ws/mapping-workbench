import {useState} from "react";

import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ShaclPackageStateReport from "./shacl_validation_report_package_state";
import ShaclTestDatasetReport from "./shacl_validation_report_test_dataset";
import ShaclFileReport from "./shacl_validation_report_file";
import CoverageFiles from "./coverage_files";

const packageState = "package_state";
const packageStateLabel = "Package State SHACL Coverage";
const testDataset = "test_dataset";
const testDatasetLabel = "Test Dataset SHACL Coverage";
const fileCoverage =  "file_coverage";
const fileCoverageLabel = "File SHACL Coverage"

const ShaclValidationReportView = ({ sid, reportTree }) => {

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
                            {testDatasetLabel}: {<b>{selectedPackageState.identifier}</b>}
                        </Link>}
                    {currentTab === fileCoverage &&
                        <Typography color="primary">
                            {fileCoverageLabel}: {<b>{selectedTestDataset.identifier}</b>}
                        </Typography>}
                </Breadcrumbs>
            </Stack>
            {currentTab === packageState &&
                <>
                    <CoverageFiles files={reportTree.test_data_suites}
                                   onClick={handleSetPackageState}/>
                    <ShaclPackageStateReport sid={sid}
                                    files={reportTree.test_data_suites}/>
                </>
            }
            {currentTab === testDataset &&
                <>
                    <CoverageFiles files={selectedPackageState?.test_data_states}
                                   onClick={handleSetTestDataset}/>
                    <ShaclTestDatasetReport sid={sid}
                                        suiteId={selectedPackageState.oid}/>
                </>
            }
            {currentTab === fileCoverage &&
                <ShaclFileReport sid={sid}
                                  suiteId={selectedPackageState.oid}
                                  testId={selectedTestDataset.oid}/>
            }
        </>
    )
}

export default ShaclValidationReportView