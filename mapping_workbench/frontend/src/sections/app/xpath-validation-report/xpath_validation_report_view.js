import Grid from '@mui/material/Unstable_Grid2';
import {useState} from "react";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import FileList from '../mapping-package/state/file-list';

import CoverageFiles from "./coverage_files";
import ResultSummaryCoverage from './result-summary-coverage';
import XpathValidationReportTest from "./xpath_validation_report_file";
import XpathValidationReport from "./xpath_validation_report_package_state";
import XpathValidationReportSuite from "./xpath_validation_report_test_dataset";

const PACKAGE_STATE = "package_state"
const PACKAGE_STATE_LABEL = "Package State XPath Coverage"
const TEST_DATASET = "test_dataset"
const TEST_DATASET_LABEL = "Test Dataset XPath Coverage"
const FILE_COVERAGE = "file";
const FILE_COVERAGE_LABEL = "File XPath Coverage"

const XpathValidationReportView = ({sid, reportTree, validationReport}) => {
    const [currentTab, setCurrentTab] = useState(PACKAGE_STATE)
    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(reportTree.test_data_suites[0].test_data_states[0])

    const handleSetPackageState = (file) => {
        console.log(file)
        setSelectedPackageState(file)
        setCurrentTab(TEST_DATASET)
    }

    const handleSetTestDataset = (file) => {
        console.log(file)
        setSelectedTestDataset(file)
        setCurrentTab(FILE_COVERAGE)
    }

    const handleSetTestAndPackage = (testDataSuite, testData) => {
        const packageState = reportTree.test_data_suites.find(tds => tds.oid === testDataSuite)
        if (testData) {
            setSelectedTestDataset(packageState?.test_data_states.find(ps => ps.oid === testData));
            setCurrentTab(FILE_COVERAGE)
        } else {
            setSelectedPackageState(packageState);
            setCurrentTab(TEST_DATASET)
        }
    }

    return (
        <Grid container
              spacing={3}>
            {currentTab === PACKAGE_STATE &&
                <>
                    <Grid xs={12}
                          md={8}>
                        <ResultSummaryCoverage item={reportTree}
                                               validationReport={validationReport}/>
                    </Grid>
                    <Grid xs={12}
                          md={4}>
                        <FileList files={reportTree.test_data_suites}
                                  handleFolderChange={handleSetPackageState}
                                  handleFileChange={handleSetTestDataset}/>
                    </Grid>
                    <Grid xs={12}>
                        <XpathValidationReport sid={sid}
                                               files={reportTree.test_data_suites}
                                               handleSelectFile={handleSetTestAndPackage}
                                               mappingSuiteIdentifier={reportTree.identifier}/>
                    </Grid>
                </>
            }
            {currentTab === TEST_DATASET &&
                <>
                    <Grid xs={12}
                          md={4}>
                        <FileList files={reportTree.test_data_suites}
                                  handleFolderChange={handleSetPackageState}
                                  handleFileChange={handleSetTestDataset}/>
                    </Grid>
                    <XpathValidationReportSuite sid={sid}
                                                suiteId={selectedPackageState.oid}
                                                files={selectedPackageState?.test_data_states}
                                                handleSelectFile={handleSetTestAndPackage}
                                                mappingSuiteIdentifier={reportTree.identifier}/>
                </>
            }
            {currentTab === FILE_COVERAGE &&
                <XpathValidationReportTest sid={sid}
                                           suiteId={selectedPackageState.oid}
                                           testId={selectedTestDataset.oid}
                                           mappingSuiteIdentifier={reportTree.identifier}/>
            }
        </Grid>
    )
}

export default XpathValidationReportView