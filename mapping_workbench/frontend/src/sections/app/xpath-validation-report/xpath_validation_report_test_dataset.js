import {useEffect, useState} from "react";

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {ListTable} from "./list-table";
import useItemsSearch from "src/hooks/use-items-search";
import {CoverageFilter, TableLoadWrapper} from "./utils";
import ResultSummaryCoverage from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const XpathValidationReportSuite = ({sid, suiteId, mappingSuiteIdentifier, handleSelectFile, handleExport}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsSuiteGet(sid, suiteId)
    }, [sid, suiteId])

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

    const itemsSearch = useItemsSearch(validationReport, sectionApi, [], {is_covered: ''});

    const handleCoverageFilterChange = e => itemsSearch.handleFiltersChange({is_covered: e})

    const FILTER_VALUES = [{label: 'All', value: '', color: 'primary', count: validationReport.length},
        {label: 'Covered', value: true, color: 'info', count: validationReport.filter(e => e.is_covered).length},
        {label: 'Uncovered', value: false, color: 'warning', count: validationReport.filter(e => !e.is_covered).length}]


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
                        <Stack direction='row'
                               alignItems='center'
                               justifyContent='space-between'
                               sx={{mx: 3}}>
                            <Typography fontWeight='bold'>Assertions</Typography>
                            <CoverageFilter values={FILTER_VALUES}
                                            onValueChange={handleCoverageFilterChange}
                                            value={itemsSearch.state.filters.is_covered}/>
                        </Stack>
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