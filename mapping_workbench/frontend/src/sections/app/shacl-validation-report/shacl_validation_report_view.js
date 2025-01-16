import {useState} from "react";

import Grid from '@mui/material/Unstable_Grid2';

import FileList from '../mapping-package/state/file-list';

import ShaclFileReport from "./shacl_validation_report_file";
import ShaclTestDatasetReport from "./shacl_validation_report_test_dataset";
import ShaclPackageStateReport from "./shacl_validation_report_package_state";

const ShaclValidationReportView = ({sid, reportTree, validationReport}) => {

    const [selectedPackageState, setSelectedPackageState] = useState()
    const [selectedTestDataset, setSelectedTestDataset] = useState()

    console.log(selectedTestDataset,selectedTestDataset)

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
                <ShaclPackageStateReport sid={sid}
                                         validationReport={validationReport}
                                         handleSelectFile={handleSetTestAndPackage}
                                         files={reportTree.test_data_suites}/>

            }
            {selectedPackageState && !selectedTestDataset &&
                <ShaclTestDatasetReport sid={sid}
                                        handleSelectFile={handleSetTestAndPackage}
                                        suiteId={selectedPackageState.oid}/>

            }
            {selectedPackageState && selectedTestDataset &&
                <ShaclFileReport sid={sid}
                                 suiteId={selectedPackageState.oid}
                                 testId={selectedTestDataset.oid}/>
            }
        </Grid>
    )
}

export default ShaclValidationReportView