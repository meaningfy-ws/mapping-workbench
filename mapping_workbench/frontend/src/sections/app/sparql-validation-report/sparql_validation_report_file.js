import {useEffect, useState} from "react";

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {ListTableFile} from "./list-table-file";

import {TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryQuery} from './result-summary-coverage';
import {mapSparqlResults, ResultFilter} from '../mapping-package/state/utils';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import {sparqlReportFiltersApi} from "../../../api/mapping-packages/reports/sparql/filters";

const FILTER_VALUES = ["valid", "unverifiable", "warning", "invalid", "error", "unknown"].map(value => ({value}))

const SparqlFileReport = ({sid, suiteId, testId, handleExport}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})
    const showSessMatchedXPATHsOnly = sparqlReportFiltersApi.getShowMatchedXPATHsOnly();
    const [showMatchedXPATHsOnly, setShowMatchedXPATHsOnly] = useState(showSessMatchedXPATHsOnly)
    const [results, setResults] = useState([]);
    useEffect(() => {
            setResults(validationReport.filter(item => !showMatchedXPATHsOnly || item.fields_covered));
        }, [showMatchedXPATHsOnly, validationReport]
    )

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId, testId)
    }, [testId])

    const handleValidationReportsGet = (sid, suiteId, testId) => {
        setDataState({load: true, error: false})
        sectionApi.getSparqlReportsTest(sid, suiteId, testId)
            .then(res => {
                setValidationReport(mapSparqlResults(res.results))
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }
    const itemsSearch = useItemsSearch(results, sectionApi, [], {result: ''}, null,  {
        "nb_comments": "desc"
    });

    const handleResultFilterChange = e => itemsSearch.handleFiltersChange({result: e.target.value})

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryQuery
                    handleExport={handleExport}
                    validationReport={results}
                    setDispatchShowMatchedXPATHsOnly={setShowMatchedXPATHsOnly}
                />
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      data={results}>
                        <Stack direction='row'
                               alignItems='center'
                               justifyContent='space-between'
                               sx={{mx: 3}}>
                            <Typography fontWeight='bold'>Assertions</Typography>
                            <ResultFilter values={FILTER_VALUES}
                                          count={results.length}
                                          onStateChange={handleResultFilterChange}
                                          currentState={itemsSearch.state.filters.result}/>
                        </Stack>
                        <ListTableFile
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
                            isResultSortable={true}
                            updateItems={setValidationReport}
                            listItems={itemsSearch.filteredItems}
                        />
                    </TableLoadWrapper>
                </Paper>
            </Grid>
        </>)
}
export default SparqlFileReport