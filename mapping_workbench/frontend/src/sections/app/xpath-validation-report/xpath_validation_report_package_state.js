import {useState} from "react";

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import {ListTable} from "./list-table";
import ResultSummaryCoverage from './result-summary-coverage';
import {CoverageFilter, TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";


const XpathValidationReport = ({validationReport, handleSelectFile, mappingSuiteIdentifier, handleExport}) => {
    const FILTER_VALUES = [{label: 'All', value: '', color: 'primary', count: validationReport.length},
        {label: 'Covered', value: true, color: 'info', count: validationReport.filter(e => e.is_covered).length},
        {label: 'Uncovered', value: false, color: 'warning', count: validationReport.filter(e => !e.is_covered).length}]


    const itemsSearch = useItemsSearch(validationReport, sectionApi, [], {is_covered: ''})

    const handleCoverageFilterChange = e => itemsSearch.handleFiltersChange({is_covered: e})

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage identifier={mappingSuiteIdentifier}
                                       handleExport={handleExport}
                                       validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Paper>
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
                </Paper>
            </Grid>
        </>
    )
}
export default XpathValidationReport