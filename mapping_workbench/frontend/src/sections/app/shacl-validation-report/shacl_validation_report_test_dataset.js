import {useEffect, useState} from "react";

import Typography from "@mui/material/Typography";

import {ListTable} from "./list-table";
import {TableLoadWrapper} from "./utils";
import ResultSummaryTable from "./result-summary-table";
// import ItemSearchInput from "../file-manager/item-search-input";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import useItemsSearch from "../../../hooks/use-items-search";


const ShaclTestDatasetReport = ({sid, suiteId, handleSelectFile}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})


    useEffect(() => {
        handleValidationReportsGet(sid, suiteId)
    }, [])

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
            <Typography m={2}
                        variant="h4">
                Results Summary
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationReport}>
                <ResultSummaryTable items={validationReport}/>
            </TableLoadWrapper>
            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationReport}>
                {/*<ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>*/}
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
        </>
    )
}
export default ShaclTestDatasetReport