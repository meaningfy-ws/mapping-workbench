import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import {ResultFilter} from '../sparql-validation-report/utils';

import {ListTable} from "./list-table";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const FILTER_VALUES = ['info', 'valid', 'violation', 'warning'].map(value => ({value: value + 'Count', label: value}))

const ShaclPackageStateReport = ({handleSelectFile, mappingSuiteIdentifier, validationReport, handleExport}) => {
    const [dataState, setDataState] = useState({load: false, error: false})

    const [resultFilter, setResultFilter] = useState('')
    const filteredItems = validationReport.filter((item) => {
        return !resultFilter || item.result[resultFilter]?.count > 0
    })

    const handleResultFilterChange = e => setResultFilter(e.target.value)

    const itemsSearch = useItemsSearch(filteredItems, sectionApi);

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage handleExport={handleExport}
                                       identifier={mappingSuiteIdentifier}
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
                            sectionApi={sectionApi}
                            handleSelectFile={handleSelectFile}
                        />
                    </TableLoadWrapper>
                </Paper>
            </Grid>
        </>
    )
}
export default ShaclPackageStateReport