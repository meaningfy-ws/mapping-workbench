import {useRouter} from 'next/router';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';

import FileList from '../mapping-package/state/file-list';
import {useFileNavigation} from '../mapping-package/state/utils';
import SparqlFileReport from "./sparql_validation_report_file";
import SparqlTestDatasetReport from "./sparql_validation_report_test_dataset";
import SparqlPackageStateReport from "./sparql_validation_report_package_state";


const SparqlValidationReportView = ({reportTree, validationReport, handleExport}) => {

    const router = useRouter()
    const {sid, packageid, datasetid} = router.query

    const {
        selectedPackageState,
        selectedTestDataset,
        handleSetTestAndPackage
    } = useFileNavigation(reportTree, 'sparql', packageid, datasetid)

    if (!validationReport) return <Stack alignItems='center'><CircularProgress/></Stack>

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
                          handleFolderAndFileChange={handleSetTestAndPackage}/>
            </Grid>
            {!selectedPackageState &&
                <SparqlPackageStateReport
                    sid={sid}
                    handleExport={handleExport}
                    validationReport={validationReport}
                    handleSelectFile={handleSetTestAndPackage}
                    files={reportTree.test_data_suites}
                />
            }
            {selectedPackageState && !selectedTestDataset &&
                <SparqlTestDatasetReport
                    sid={sid}
                    handleExport={handleExport}
                    handleSelectFile={handleSetTestAndPackage}
                    suiteId={selectedPackageState}
                />

            }
            {selectedPackageState && selectedTestDataset &&
                <SparqlFileReport
                    sid={sid}
                    handleExport={handleExport}
                    suiteId={selectedPackageState}
                    testId={selectedTestDataset}
                />
            }
        </Grid>
    )
}

export default SparqlValidationReportView