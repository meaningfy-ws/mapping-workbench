import {useState} from "react";

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {ListTable} from "./list-table";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultFilter} from '../mapping-package/state/utils';
import {ResultSummaryCoverage} from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const FILTER_VALUES = ['info', 'valid', 'violation', 'warning'].map(value => ({value: value + 'Count', label: value}))

const ShaclPackageStateReport = ({handleSelectFile, mappingSuiteIdentifier, validationReport, handleExport}) => {
    const [resultFilter, setResultFilter] = useState('')

    const filteredItems = validationReport.filter((item) => !resultFilter || item[resultFilter] > 0)

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
                </Paper>
            </Grid>
        </>
    )
}
export default ShaclPackageStateReport