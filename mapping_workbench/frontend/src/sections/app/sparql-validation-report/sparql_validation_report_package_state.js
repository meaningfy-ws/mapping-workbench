import {useEffect, useState} from "react";

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import {ListTable} from "./list-table";
import {filterXPATHFieldsCoveredResults, mapSparqlResultEntry, ResultFilter} from '../mapping-package/state/utils';
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import {sparqlReportFiltersApi} from "../../../api/mapping-packages/reports/sparql/filters";

const FILTER_VALUES = ["valid", "unverifiable", "warning", "invalid", "error", "unknown"]
    .map(value => ({value: value, label: value}))

const SparqlValidationReport = (
    {handleSelectFile, validationReport, handleExport}) => {
    const [resultFilter, setResultFilter] = useState('')
    const showSessMatchedXPATHsOnly = sparqlReportFiltersApi.getShowMatchedXPATHsOnly();
    const [showMatchedXPATHsOnly, setShowMatchedXPATHsOnly] = useState(showSessMatchedXPATHsOnly)
    const [filteredItems, setFilteredItems] = useState([]);
    const [results, setResults] = useState([]);
    useEffect(() => {
            const fResults = filterXPATHFieldsCoveredResults(validationReport, showMatchedXPATHsOnly);
            setResults(fResults);
            setFilteredItems(
                fResults.reduce((acc, item) => {
                    if (!resultFilter || (item?.result[resultFilter]?.count || 0) > 0) {
                        mapSparqlResultEntry(item);
                        acc.push(item);
                    }
                    return acc;
                }, [])
            )
        }, [showMatchedXPATHsOnly, validationReport, resultFilter]
    )

    const itemsSearch = useItemsSearch(filteredItems, sectionApi, [], {result: ''});
    const handleResultFilterChange = e => {
        setResultFilter(e.target.value);
        itemsSearch.handleFilterResultChange();
    }

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage
                    handleExport={handleExport}
                    validationReport={results}
                    setDispatchShowMatchedXPATHsOnly={setShowMatchedXPATHsOnly}
                />
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <Stack direction='row'
                           alignItems='center'
                           justifyContent='space-between'
                           sx={{mx: 3}}>
                        <Typography fontWeight='bold'>Assertions</Typography>
                        <ResultFilter values={FILTER_VALUES}
                                      count={results.length}
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
        </>)
}

export default SparqlValidationReport