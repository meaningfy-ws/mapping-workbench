import {useState} from "react";

import Grid from '@mui/material/Unstable_Grid2';

import FileList from '../mapping-package/state/file-list';
import ResultSummaryCoverage from './result-summary-coverage';

import SparqlFileReport from "./sparql_validation_report_file";
import SparqlTestDatasetReport from "./sparql_validation_report_test_dataset";
import SparqlPackageStateReport from "./sparql_validation_report_package_state";

const SparqlValidationReportView = ({sid, reportTree, validationReport}) => {

    const [selectedPackageState, setSelectedPackageState] = useState()
    const [selectedTestDataset, setSelectedTestDataset] = useState()

    const handleSetPackageState = (file) => {
        setSelectedPackageState(file)
    }

    const handleSetTestDataset = (file) => {
        setSelectedTestDataset(file)
    }

    const handleSetTestAndPackage = (testDataSuite, testData) => {
        const packageState = reportTree.test_data_suites.find(tds => tds.oid === testDataSuite)
        if (testData) {
            setSelectedTestDataset(packageState?.test_data_states.find(ps => ps.oid === testData));
        } else {
            setSelectedPackageState(packageState);
        }
    }

    console.log(selectedPackageState,selectedTestDataset)

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
                <>
                    <Grid xs={12}
                          md={8}>
                        <ResultSummaryCoverage validationReport={validationReport}/>
                    </Grid>
                    <Grid xs={12}>
                        <SparqlPackageStateReport
                            sid={sid}
                            handleSelectFile={handleSetTestAndPackage}
                            files={reportTree.test_data_suites}
                        />
                    </Grid>
                </>
            }
            {selectedPackageState && !selectedTestDataset &&
                <SparqlTestDatasetReport
                    sid={sid}
                    handleSelectFile={handleSetTestAndPackage}
                    suiteId={selectedPackageState.oid}
                />

            }
            {selectedPackageState && selectedTestDataset &&
                <SparqlFileReport
                    sid={sid}
                    suiteId={selectedPackageState.oid}
                    testId={selectedTestDataset.oid}
                />
            }
        </Grid>
    )
}

export default SparqlValidationReportView