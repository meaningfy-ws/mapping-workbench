import {useEffect, useState} from "react";

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {ListTable} from "./list-table";
import {TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {filterXPATHFieldsCoveredResults, mapSparqlResults, ResultFilter} from '../mapping-package/state/utils';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import {sparqlReportFiltersApi} from "../../../api/mapping-packages/reports/sparql/filters";

const FILTER_VALUES = ["valid", "unverifiable", "warning", "invalid", "error", "unknown"]
    .map(value => ({value: value, label: value}))

const SparqlTestDatasetReport = (
    {
        sid, suiteId, handleSelectFile, handleExport
    }) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})
    const [resultFilter, setResultFilter] = useState('')
    const showSessMatchedXPATHsOnly = sparqlReportFiltersApi.getShowMatchedXPATHsOnly();
    const [showMatchedXPATHsOnly, setShowMatchedXPATHsOnly] = useState(showSessMatchedXPATHsOnly)
    const [filteredItems, setFilteredItems] = useState([]);
    const [results, setResults] = useState([]);
    useEffect(() => {
            const fResults = filterXPATHFieldsCoveredResults(validationReport, showMatchedXPATHsOnly);
            setResults(fResults);
            setFilteredItems(fResults.filter((item) => { return !resultFilter || (item?.result[resultFilter]?.count || 0) > 0 }));
        }, [showMatchedXPATHsOnly, validationReport, resultFilter]
    )

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId)
    }, [sid, suiteId])

    const handleResultFilterChange = e => {
        setResultFilter(e.target.value);
        itemsSearch.handleFilterResultChange();
    }

    const handleValidationReportsGet = (sid, suiteId) => {
        setDataState({load: true, error: false})
        sectionApi.getSparqlReportsSuite(sid, suiteId)
            .then(res => {
                setValidationReport(mapSparqlResults(res.summary))
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
                <ResultSummaryCoverage
                    handleExport={handleExport}
                    validationReport={results}
                    setDispatchShowMatchedXPATHsOnly={setShowMatchedXPATHsOnly}
                />
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      lines={6}
                                      data={results}>
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
                    </TableLoadWrapper>
                </Paper>
            </Grid>
        </>
    )
}
export default SparqlTestDatasetReport