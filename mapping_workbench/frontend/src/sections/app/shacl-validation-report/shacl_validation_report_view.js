import Grid from '@mui/material/Unstable_Grid2';

import FileList from '../mapping-package/state/file-list';
import {useFileNavigation} from '../mapping-package/state/utils';
import ShaclFileReport from "./shacl_validation_report_file";
import ShaclTestDatasetReport from "./shacl_validation_report_test_dataset";
import ShaclPackageStateReport from "./shacl_validation_report_package_state";

const ShaclValidationReportView = ({sid, reportTree, validationReport, handleExport}) => {

    const {
        selectedPackageState,
        selectedTestDataset,
        handleSetPackageState,
        handleSetTestDataset,
        handleSetTestAndPackage
    } = useFileNavigation(reportTree)

    return (

        <Grid container
              direction='row-reverse'
              spacing={3}>
            <Grid xs={12}
                  md={4}>
                <FileList maxHeight={272}
                          files={reportTree.test_data_suites}
                          selectedPackageState={selectedPackageState}
                          selectedTestDataset={selectedTestDataset}
                          handleFolderChange={handleSetPackageState}
                          handleFileChange={handleSetTestDataset}/>
            </Grid>
            {!selectedPackageState &&
                <ShaclPackageStateReport sid={sid}
                                         handleExport={handleExport}
                                         validationReport={validationReport}
                                         handleSelectFile={handleSetTestAndPackage}
                                         files={reportTree.test_data_suites}/>

            }
            {selectedPackageState && !selectedTestDataset &&
                <ShaclTestDatasetReport sid={sid}
                                        handleExport={handleExport}
                                        handleSelectFile={handleSetTestAndPackage}
                                        suiteId={selectedPackageState.oid}/>

            }
            {selectedPackageState && selectedTestDataset &&
                <ShaclFileReport sid={sid}
                                 handleExport={handleExport}
                                 suiteId={selectedPackageState.oid}
                                 testId={selectedTestDataset.oid}/>
            }
        </Grid>
    )
}

export default ShaclValidationReportView