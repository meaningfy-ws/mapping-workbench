import {useState} from "react";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import CoverageFiles from "./coverage_files";
import SparqlPackageStateReport from "./sparql_validation_report_package_state";
import SparqlTestDatasetReport from "./sparql_validation_report_test_dataset";
import SparqlFileReport from "./sparql_validation_report_file";

const packageState = "package_state";
const packageStateLabel = "Package State SPARQL Coverage";
const testDataset = "test_dataset";
const testDatasetLabel = "Test Dataset SPARQL Coverage";
const fileCoverage =  "file_coverage";
const fileCoverageLabel = "File SPARQL Coverage"

const SparqlValidationReportView = ({ sid, reportTree }) => {

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
                    <SparqlPackageStateReport sid={sid}
                                    files={reportTree.test_data_suites}/>
                </>
            }
            {currentTab === testDataset &&
                <>
                    <CoverageFiles files={selectedPackageState?.test_data_states}
                                   onClick={handleSetTestDataset}
                                   fileIcon/>
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