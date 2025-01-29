import {useEffect, useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import {TableLoadWrapper} from "./utils";
import {ResultTable} from "./result-table";
import {ListTableFile} from "./list-table-file";
import useItemsSearch from "src/hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";


const ShaclFileReport = ({sid, suiteId, testId}) => {
    const [validationReport, setValidationReport] = useState([])
    const [validationResult, setValidationResult] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId, testId)
    }, [testId])

    const handleValidationReportsGet = (sid, suiteId, testId) => {
        setDataState({load: true, error: false})
        sectionApi.getSparqlReportsFile(sid, suiteId, testId)
            .then(res => {
                setValidationReport(mapShaclFileResults(res.results?.[0]?.results?.[0]?.results) ?? [])
                setValidationResult(mapShaclFileStates(res.results?.[0]) ?? []);
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const mapShaclFileStates = (states) => states?.results.map(e => ({
        conforms: e.conforms, error: e.error, title: states.shacl_suite.shacl_suite_id
    }))


    const mapShaclFileResults = (result) => result?.map(e => ({...e.binding}))

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      data={validationResult}
                                      lines={2}>
                        <ResultTable items={validationResult}
                                     sectionApi={sectionApi}/>
                    </TableLoadWrapper>
                </Paper>
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      data={validationReport}>
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
                        />
                    </TableLoadWrapper>
                </Paper>
            </Grid>
        </>
    )
}
export default ShaclFileReport