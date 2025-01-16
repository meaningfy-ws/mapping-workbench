import {useState} from "react";

import Grid from '@mui/material/Unstable_Grid2';

import FileList from '../mapping-package/state/file-list';
import XpathValidationReportTest from "./xpath_validation_report_file";
import XpathValidationReport from "./xpath_validation_report_package_state";
import XpathValidationReportSuite from "./xpath_validation_report_test_dataset";

const XpathValidationReportView = ({sid, reportTree, validationReport, handleExport}) => {
    const [selectedPackageState, setSelectedPackageState] = useState()
    const [selectedTestDataset, setSelectedTestDataset] = useState()

    const handleSetPackageState = (file) => {
        setSelectedPackageState(file)
        setSelectedTestDataset(undefined)
    }

    const handleSetTestDataset = (file) => {
        setSelectedTestDataset(file)
    }

    const handleSetTestAndPackage = (testDataSuite, testData) => {
        const packageState = reportTree.test_data_suites.find(tds => tds.oid === testDataSuite)
        setSelectedPackageState(packageState)
        if (testData) {
            setSelectedTestDataset(packageState?.test_data_states.find(ps => ps.oid === testData));
        } else {
            setSelectedTestDataset(undefined)
        }
    }

    return (
        <Grid container
              direction='row-reverse'
              spacing={3}>
            <Grid xs={12}
                  md={4}>
                <FileList files={reportTree.test_data_suites}
                          selectedPackageState={selectedPackageState}
                          selectedTestDataset={selectedTestDataset}
                          handleFolderChange={handleSetPackageState}
                          handleFileChange={handleSetTestDataset}/>
            </Grid>
            {!selectedPackageState &&
                <XpathValidationReport sid={sid}
                                       handleExport={handleExport}
                                       validationReport={validationReport}
                                       files={reportTree.test_data_suites}
                                       handleSelectFile={handleSetTestAndPackage}
                                       mappingSuiteIdentifier={reportTree.identifier}/>
            }
            {selectedPackageState && !selectedTestDataset &&
                <XpathValidationReportSuite sid={sid}
                                            handleExport={handleExport}
                                            suiteId={selectedPackageState.oid}
                                            files={selectedPackageState?.test_data_states}
                                            handleSelectFile={handleSetTestAndPackage}
                                            mappingSuiteIdentifier={reportTree.identifier}/>
            }
            {selectedPackageState && selectedTestDataset &&
                <XpathValidationReportTest sid={sid}
                                           handleExport={handleExport}
                                           suiteId={selectedPackageState.oid}
                                           testId={selectedTestDataset.oid}
                                           mappingSuiteIdentifier={reportTree.identifier}/>
            }
        </Grid>
    )
}

export default XpathValidationReportView