import {useEffect, useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import {ListTable} from "./list-table";
import {TableLoadWrapper} from "./utils";
import {ResultSummaryCoverage} from './result-summary-coverage';
import useItemsSearch from "src/hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";


const ShaclTestDatasetReport = ({sid, suiteId, handleSelectFile}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})


    useEffect(() => {
        handleValidationReportsGet(sid, suiteId)
    }, [suiteId])

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

    const mapShaclResults = (result) => {
        return result.results.map(e => {
            const resultArray = {}
            resultArray["shacl_suite"] = result.shacl_suites?.[0]?.shacl_suite_id
            resultArray["short_result_path"] = e.short_result_path
            resultArray["result"] = e.result
            Object.entries(e.result).forEach(entrie => {
                const [key, value] = entrie
                resultArray[`${key}Count`] = value.count
            })
            return resultArray;
        })
    }

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      data={validationReport}>
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
export default ShaclTestDatasetReport