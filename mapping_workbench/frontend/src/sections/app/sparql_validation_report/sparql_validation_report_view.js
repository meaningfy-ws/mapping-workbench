import {useEffect, useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {ListTable} from "./list-table";
import {QueryResultTable} from "./query-result-table";
import ItemSearchInput from "../file-manager/item-search-input";
import SparqlValidationReport from "./sparql_validation_report_package_state";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CoverageFiles from "../xpath_validation_report/coverage_files";
import XpathValidationReport from "../xpath_validation_report/xpath_validation_report_package_state";
import XpathValidationReportSuite from "../xpath_validation_report/xpath_validation_report_test_dataset";

const pacakageState = "package_state", testDataset = "test_dataset", file =  "file";

const tabs = [
    {label: 'Package State XPath Coverage', value: pacakageState},
    {label: 'Test Dataset XPath Coverage', value: testDataset},
    {label: 'File XPath Coverage', value: file},
];

const SparqlValidationReportView = ({ sid, reportTree }) => {
    // const [selectedValidationFile, setSelectedValidationFile] = useState(reportTree.test_data_suites[0])
    // const [validationReport, setValidationReport] = useState(reportTree.test_data_suites[0].test_data_states[0])
    // const [dataLoad, setDataLoad] = useState(true)
    // const [currentTab, setCurrentTab] = useState(tabs[0].value)

    const [selectedPackageState, setSelectedPackageState] = useState(reportTree.test_data_suites[0])
    const [selectedTestDataset, setSelectedTestDataset] = useState(reportTree.test_data_suites[0].test_data_states[0])
    const [currentTab, setCurrentTab] = useState(tabs[0].value)

    const handleFileClick = (file, tab) => {
        if(tab === "test_dataset")
        {
            setSelectedPackageState(file)
            setSelectedTestDataset({})
        }
        else setSelectedTestDataset(file)
        setCurrentTab(tab)
    }

    return <>
                {/*<QueryResultTable*/}
                {/*    items={validationReport}*/}
                {/*/>*/}
                {/*<ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>*/}
                {/*<ListTable*/}
                {/*    items={itemsSearch.pagedItems}*/}
                {/*    count={itemsSearch.pagedItems?.length}*/}
                {/*    onPageChange={itemsSearch.handlePageChange}*/}
                {/*    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}*/}
                {/*    page={itemsSearch.state.page}*/}
                {/*    rowsPerPage={itemsSearch.state.rowsPerPage}*/}
                {/*    onSort={itemsSearch.handleSort}*/}
                {/*    sort={itemsSearch.state.sort}*/}
                {/*    sectionApi={sectionApi}*/}
                {/*/>*/}
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
                        {currentTab === file &&
                            <Typography>
                                File XPath Coverage: {selectedTestDataset.identifier}
                            </Typography>}
                    </Breadcrumbs>
                </Stack>
                {currentTab === pacakageState &&
                    <>
                        <CoverageFiles files={reportTree.test_data_suites}
                                       onClick={handleFileClick}
                                       tab={testDataset}/>
                        <SparqlValidationReport sid={sid}
                                        files={reportTree.test_data_suites}
                                        mappingSuiteIdentifier={reportTree.identifier}/>
                    </>
                }
                {currentTab === testDataset &&
                    <>
                        <CoverageFiles files={selectedPackageState?.test_data_states}
                                       onClick={handleFileClick}
                                       tab={file}/>
                        <XpathValidationReportSuite sid={sid}
                                            suiteId={selectedPackageState.oid}
                                            files={selectedPackageState?.test_data_states}
                                            mappingSuiteIdentifier={reportTree.identifier}/>
                    </>
                }
            </>
}

export default SparqlValidationReportView