import {useEffect, useState} from "react";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";

import Typography from "@mui/material/Typography";

// import ItemSearchInput from "../file-manager/item-search-input";
import {ListTable} from "./list-table";
import ResultSummaryTable from "./result-summary-table";
import {TableLoadWrapper} from "./utils";
import useItemsSearch from "../../../hooks/use-items-search";


const SparqlValidationReport = ({sid, handleSelectFile}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsGet(sid)
    }, [])

    const handleValidationReportsGet = (sid) => {
        setDataState({load: true, error: false})
        sectionApi.getSparqlReports(sid)
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

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    return (
        <>
            <TableLoadWrapper dataState={dataState}
                              lines={6}
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
        </>)
}

export default SparqlValidationReport