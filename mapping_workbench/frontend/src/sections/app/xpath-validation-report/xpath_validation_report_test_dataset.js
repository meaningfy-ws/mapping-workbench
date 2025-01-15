import Grid from '@mui/material/Unstable_Grid2';
import {useEffect, useState} from "react";

import Card from '@mui/material/Card';

import {ListTable} from "./list-table";
import {CoverageFilter, TableLoadWrapper} from "./utils";
import ResultSummaryCoverage from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";
import useItemsSearch from "../../../hooks/use-items-search";

const XpathValidationReportSuite = ({sid, suiteId, files, mappingSuiteIdentifier, handleSelectFile}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsSuiteGet(sid, suiteId)
    }, [suiteId])

    const handleValidationReportsSuiteGet = (sid, suiteId) => {
        setDataState({load: true, error: false})
        sectionApi.getXpathReportsSuite(sid, suiteId)
            .then(res => {
                setValidationReport(res.results.map(e => ({...e, notice_count: e.test_data_xpaths.length})))
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    const handleCoverageFilterChange = e => itemsSearch.handleFiltersChange({is_covered: e.target.value})

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage load={dataState.load}
                                       identifier={mappingSuiteIdentifier}
                                       validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Card>
                    <TableLoadWrapper dataState={dataState}
                                      data={validationReport}>
                        <CoverageFilter onChange={handleCoverageFilterChange}
                                        filterState={itemsSearch.state.filters.is_covered}/>
                        <ListTable
                            items={itemsSearch.pagedItems}
                            count={itemsSearch.count}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            onSort={itemsSearch.handleSort}
                            sort={itemsSearch.state.sort}
                            onFilter={itemsSearch.handleFiltersChange}
                            filters={itemsSearch.state.filters}
                            handleSelectFile={handleSelectFile}
                            sectionApi={sectionApi}
                        />
                    </TableLoadWrapper>
                </Card>
            </Grid>
        </>
    )
}
export default XpathValidationReportSuite