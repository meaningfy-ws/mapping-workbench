import {useRouter} from 'next/router';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';

import FileList from '../mapping-package/state/file-list';
import {useFileNavigation} from '../mapping-package/state/utils';
import XpathValidationReportTest from "./xpath_validation_report_file";
import XpathValidationReport from "./xpath_validation_report_package_state";
import XpathValidationReportSuite from "./xpath_validation_report_test_dataset";

const XpathValidationReportView = ({reportTree, validationReport, handleExport}) => {
    const router = useRouter();
    const {sid, packageid, datasetid} = router.query

    const {
        selectedPackageState,
        selectedTestDataset,
        handleSetTestAndPackage
    } = useFileNavigation(reportTree, 'xpath', packageid, datasetid)

    if (!validationReport) return <Stack alignItems='center'><CircularProgress/></Stack>

    return (
        <Grid container
              direction='row-reverse'
              spacing={3}>
            <Grid xs={12}
                  md={4}>
                <FileList maxHeight={300}
                          files={reportTree.test_data_suites}
                          selectedPackageState={selectedPackageState}
                          selectedTestDataset={selectedTestDataset}
                          handleFolderAndFileChange={handleSetTestAndPackage}/>
            </Grid>
            {!selectedPackageState &&
                <XpathValidationReport handleExport={handleExport}
                                       validationReport={validationReport}
                                       files={reportTree.test_data_suites}
                                       handleFolderAndFileChange={handleSetTestAndPackage}
                                       mappingSuiteIdentifier={reportTree.identifier}/>
            }
            {selectedPackageState && !selectedTestDataset &&
                <XpathValidationReportSuite sid={sid}
                                            handleExport={handleExport}
                                            suiteId={selectedPackageState}
                                            handleFolderAndFileChange={handleSetTestAndPackage}
                                            mappingSuiteIdentifier={reportTree.identifier}/>
            }
            {selectedPackageState && selectedTestDataset &&
                <XpathValidationReportTest sid={sid}
                                           handleExport={handleExport}
                                           suiteId={selectedPackageState}
                                           testId={selectedTestDataset}
                                           mappingSuiteIdentifier={reportTree.identifier}/>
            }
        </Grid>
    )
}

export default XpathValidationReportView