import {useEffect, useState} from "react";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";

import Typography from "@mui/material/Typography";

import ItemSearchInput from "../file-manager/item-search-input";
import {ListTableFile} from "./list-table-file";
import {QueryResultTable} from "./query-result-table";
import {ResultFilter, TableLoadWrapper} from "./utils";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
            result: ""
        },
        sort: {
        },
        search: [],
        searchColumns:[],
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const {show, ...filters} = state.filters

    const searchItems = state.search.length ? items.filter(item => {
        let returnItem = null;
        state.searchColumns.forEach(column => {
            state.search.forEach(search => {
                if(item[column]?.toLowerCase()?.includes(search.toLowerCase()))
                    returnItem = item
            })
        })
        return returnItem
    }) : items

    const filteredItems = searchItems.filter((item) => {
        let returnItem = item;
        Object.entries(filters).forEach(filter=> {
            const [key, value] = filter
            if(value !== "" && value !== undefined && typeof item[key] === "boolean" && item[key] !== (value == "true"))
                returnItem = null
            if(value !== "" && value !== undefined && typeof item[key] === "string" && item[key] !== value.toLowerCase())
                returnItem = null
        })
        return returnItem
    })

    const sortedItems = () => {
        const sortColumn = state.sort.column
        if(!sortColumn) {
            return filteredItems
        } else {
            return filteredItems.sort((a,b) => {
                if (typeof a[sortColumn] === "string")
                    return state.sort.direction === "asc" ?
                        a[sortColumn]?.localeCompare(b[sortColumn]) :
                        b[sortColumn]?.localeCompare(a[sortColumn])
                else
                    return state.sort.direction === "asc" ?
                        a[sortColumn] - b[sortColumn] :
                        b[sortColumn] - a[sortColumn]
                })
        }
    }

    const pagedItems = sortedItems().filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (filters) => {
        setState(prevState=> ({...prevState, search: filters }))
    }

    const handleFiltersChange = (filters) => {
        setState(prevState=> ({
            ...prevState,
            filters,
            page: 0
        }));
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    }

    const handleSort = (column) => {
        setState(prevState=> ({ ...prevState, sort: {column,
                direction: prevState.sort.column === column && prevState.sort.direction === "asc" ? "desc" : "asc"}}))
    }
    const handleRowsPerPageChange = (event) => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        handleSearchItems,
        pagedItems,
        count: filteredItems.length,
        state
    };
};

const SparqlFileReport = ({ sid, suiteId, testId, files, mappingSuiteIdentifier }) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load:true, error:false})

    useEffect(()=>{
        handleValidationReportsGet(sid, suiteId, testId)
    },[])

    const handleValidationReportsGet = async (sid, suiteId, testId) => {
        try {
            setDataState({load:true, error:false})
            const result = await sectionApi.getSparqlReportsTest(sid, suiteId, testId)
            setValidationReport(mapSparqlResults(result.results))
            setDataState(e=>({...e, load: false}))
        } catch (err) {
            console.error(err);
            setDataState({load:false, error:true})
        }
    }

    const mapSparqlResults = (result) => result.map(e=> {
        const queryAsArray = e.query.content.split("\n")
        const values = queryAsArray.slice(0,3)
        const resultArray = {}
        values.forEach(e => {
                const res = e.split(": ")
                resultArray[res[0].substring(1)] = res[1]
            }
        )
        resultArray["query"] = queryAsArray.slice(4, queryAsArray.length).join("\n")
        resultArray["query_result"] = e.query_result
        resultArray["result"] = e.result
        return resultArray;
    })

    const itemsSearch = useItemsSearch(validationReport);

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
                    <ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>
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
                            sectionApi={sectionApi}
                    />
            </TableLoadWrapper>
        </>)
}
export default  SparqlFileReport