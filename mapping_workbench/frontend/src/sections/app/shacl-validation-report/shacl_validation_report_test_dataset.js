import {useEffect, useState} from "react";

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {ListTable} from "./list-table";
import {TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {mapShaclResults, ResultFilter} from '../mapping-package/state/utils';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const FILTER_VALUES = ['info', 'valid', 'violation', 'warning'].map(value => ({value: value + 'Count', label: value}))

const ShaclTestDatasetReport = ({sid, suiteId, handleSelectFile, handleExport}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})
    const [resultFilter, setResultFilter] = useState('')

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId)
    }, [suiteId])

    const filteredItems = validationReport.filter((item) => !resultFilter || item[resultFilter] > 0)

    const handleResultFilterChange = e => setResultFilter(e.target.value)

    const handleValidationReportsGet = (sid, suiteId) => {
        setDataState({load: true, error: false})
        sectionApi.getShaclReportsSuite(sid, suiteId)
            .then(res => {
                setValidationReport(mapShaclResults(res.summary))
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const itemsSearch = useItemsSearch(filteredItems, sectionApi);


    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage handleExport={handleExport}
                                       validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      data={validationReport}>
                        <Stack direction='row'
                               alignItems='center'
                               justifyContent='space-between'
                               sx={{mx: 3}}>
                            <Typography fontWeight='bold'>Assertions</Typography>
                            <ResultFilter values={FILTER_VALUES}
                                          count={validationReport.length}
                                          onStateChange={handleResultFilterChange}
                                          currentState={resultFilter}/>
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
                            resultFilter={resultFilter}
                            sectionApi={sectionApi}
                            handleSelectFile={handleSelectFile}
                        />
                    </TableLoadWrapper>
                </Paper>
            </Grid>
        </>
    )
}
export default ShaclTestDatasetReport