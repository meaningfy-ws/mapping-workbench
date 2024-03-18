import {useEffect, useState} from "react";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";

import Typography from "@mui/material/Typography";

import ItemSearchInput from "../file-manager/item-search-input";
import {ListTableFile} from "./list-table-file";
import {ResultTable} from "./result-table";
import {TableLoadWrapper} from "./utils";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
            result: ""
        },
        sort: {
            column: "",
            direction: "desc"
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

const ShaclFileReport = ({ sid, suiteId, testId, files, mappingSuiteIdentifier }) => {
    const [validationReport, setValidationReport] = useState([])
    const [validationResult, setValidationResult] = useState([])
    const [dataLoad, setDataLoad] = useState(true)

    useEffect(()=>{
        handleValidationReportsGet(sid, suiteId, testId)
    },[])

    const handleValidationReportsGet = async (sid, suiteId, testId) => {
        try {
            const result = await sectionApi.getSparqlReportsFile(sid, suiteId, testId)
            setValidationReport(mapShaclFileResults(result.results?.[0]?.results?.[0]?.results))
            setValidationResult(mapShaclFileStates(result.results?.[0]));
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoad(false)
        }
    }

    const mapShaclFileStates = (states) => {
        return states.results.map(e => ({
            conforms: e.conforms, error: e.error, title: states.shacl_suite.shacl_suite_id
        }))
    }

    const mapShaclFileResults = (result) => result.map(e=> ({...e.binding}))

    const itemsSearch = useItemsSearch(validationReport);

    return (
        <>
             <Typography m={2}
                        variant="h4">
                Results
            </Typography>
            <TableLoadWrapper load={dataLoad}
                              data={validationResult}
                              lines={2}>
                <ResultTable items={validationResult}
                         sectionApi={sectionApi}/>
            </TableLoadWrapper>
            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <TableLoadWrapper load={dataLoad}
                              data={validationReport}>
                    <ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>
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
        </>
    )
}
export default  ShaclFileReport