import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import {ListTable} from "./list-table";
import {ResultFilter, TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const FILTER_VALUES = [{value: "validCount:", label: "valid"}, {value: "unverifiableCount", label: "unverifiable"},
    {value: "warningCount", label: "warning"}, {value: "invalidCount", label: "invalid"},
    {value: "errorCount", label: "error"}, {value: "unknownCount", label: "unknown"}]

const SparqlValidationReport = ({handleSelectFile, validationReport, handleExport}) => {
    const [dataState, setDataState] = useState({load: false, error: false})
    const [resultFilter, setResultFilter] = useState('')

    const filteredItems = validationReport.filter((item) => {
        return !resultFilter || item.result[resultFilter]?.count > 0
    })

    const itemsSearch = useItemsSearch(filteredItems, sectionApi, [], {result: ''});
    const handleResultFilterChange = e => setResultFilter(e.target.value)

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
                                      lines={6}
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
        </>)
}

export default SparqlValidationReport