import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import {ListTable} from "./list-table";
import {ResultFilter, TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const FILTER_VALUES = [{value: "validCount:", label: "valid"},
    {value: "unverifiableCount", label: "unverifiable"},
    {value: "warningCount", label: "warning"}, {value: "invalidCount", label: "invalid"},
    {value: "errorCount", label: "error"}, {value: "unknownCount", label: "unknown"}]

const SparqlTestDatasetReport = ({sid, suiteId, handleSelectFile, handleExport}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})
    const [resultFilter, setResultFilter] = useState('')

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId)
    }, [sid, suiteId])

    const handleResultFilterChange = e => setResultFilter(e.target.value)

    const filteredItems = validationReport.filter((item) => {
        return !resultFilter || item.result[resultFilter]?.count > 0
    })

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

    const mapSparqlResults = (result) => result.map(e => {
        const queryAsArray = e.query.content.split("\n")
        const values = queryAsArray.slice(0, 3)
        const resultArray = {}
        values.forEach(e => {
                const res = e.split(": ")
                resultArray[res[0].substring(1)] = res[1]
            }
        )
        resultArray["query"] = queryAsArray.slice(4, queryAsArray.length).join("\n")
        resultArray["test_suite"] = e.query.filename
        resultArray["result"] = e.result
        Object.entries(e.result).forEach(entrie => {
            const [key, value] = entrie
            resultArray[`${key}Count`] = value.count
        })
        resultArray["meets_xpath_condition"] = e.meets_xpath_condition
        resultArray["xpath_condition"] = e.query?.cm_rule?.xpath_condition
        return resultArray;
    })

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
        </>
    )
}
export default SparqlTestDatasetReport