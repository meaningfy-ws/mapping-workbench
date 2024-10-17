import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";

import {ListTableFile} from "./list-table-file";
import {QueryResultTable} from "./query-result-table";
import {ResultFilter, TableLoadWrapper} from "./utils";
import ItemSearchInput from "../file-manager/item-search-input";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import useItemsSearch from "../../../hooks/use-items-search";


const SparqlFileReport = ({sid, suiteId, testId}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId, testId)
    }, [])

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
        resultArray["query_result"] = e.query_result
        resultArray["fields_covered"] = e.fields_covered
        resultArray["result"] = e.result
        resultArray["meets_xpath_condition"] = e.meets_xpath_condition
        resultArray["xpath_condition"] = e.query?.cm_rule?.xpath_condition
        return resultArray;
    })

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    const handleResultFilterChange = e => {
        itemsSearch.handleFiltersChange({result: e.target.value})
    }

    return (
        <>
            <Typography m={2}
                        variant="h4">
                Results Summary
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              lines={6}
                              data={validationReport}>
                <QueryResultTable
                    items={validationReport}
                />
            </TableLoadWrapper>
            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationReport}>
                {/*<ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>*/}
                <ResultFilter onStateChange={handleResultFilterChange}
                              currentState={itemsSearch.state.filters.result}/>
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
        </>)
}
export default SparqlFileReport