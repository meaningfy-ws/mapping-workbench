import {useEffect, useState} from "react";

import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';

import {TableLoadWrapper} from "./utils";
import {ListTable} from "./list-table-file";
import ResultSummaryCoverage from './result-summary-coverage';
import useItemsSearch from "../../../hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";

const XpathValidationReportTest = ({sid, suiteId, testId, mappingSuiteIdentifier, handleExport}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsTestGet(sid, suiteId, testId)
    }, [testId])

    const handleValidationReportsTestGet = (sid, suiteId, testId) => {
        setDataState({load: true, error: false})
        sectionApi.getXpathReportsTest(sid, suiteId, testId)
            .then(res => {
                setValidationReport(res.results)
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage load={dataState.load}
                                       handleExport={handleExport}
                                       identifier={mappingSuiteIdentifier}
                                       validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Card>
                    <TableLoadWrapper dataState={dataState}
                                      data={validationReport}>
                        <ListTable
                            items={itemsSearch.pagedItems}
                            count={itemsSearch.count}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            onFilter={itemsSearch.handleFiltersChange}
                            filters={itemsSearch.state.filters}
                            onSort={itemsSearch.handleSort}
                            sort={itemsSearch.state.sort}
                            sectionApi={sectionApi}
                        />
                    </TableLoadWrapper>
                </Card>
            </Grid>
        </>
    )
}
export default XpathValidationReportTest