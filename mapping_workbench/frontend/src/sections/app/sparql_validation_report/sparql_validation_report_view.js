import {useEffect, useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {ListTable} from "./list-table";
import {QueryResultTable} from "./query-result-table";
import ItemSearchInput from "../file-manager/item-search-input";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {},
        sort: {},
        search: [],
        searchColumns:["description", "query", "title", "xpath"],
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

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

    const sortedItems = searchItems.sort((a,b) => {
        const sortColumn = state.sort.column
        if(!sortColumn) return
        return state.sort.direction === "asc" ?
             a[sortColumn].localeCompare(b[sortColumn]) :
             b[sortColumn].localeCompare(a[sortColumn])
    })

    const pagedItems = sortedItems.filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (filters) => {
        setState(prevState => ({...prevState, search: filters }))
    }

    const handleFiltersChange = (filters) => {
        setState((prevState) => ({
            ...prevState,
            filters,
            page: 0
        }));
    }

     const handleSort = (column) => {
        setState(prevState=> ({ ...prevState, sort: {column,
                direction: prevState.sort.column === column && prevState.sort.direction === "asc" ? "desc" : "asc"}}))
    }

    const handlePageChange = (event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    }
    const handleRowsPerPageChange = (event) => {
        setState((prevState) => ({
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
        count: searchItems.length,
        state
    };
};

const SparqlValidationReport = ({ project_id, id, sid, files }) => {
    const [selectedValidationFile, setSelectedValidationFile] = useState(files[0])
    const [validationReport, setValidationReport] = useState([])
    const [dataLoad, setDataLoad] = useState(true)

    useEffect(()=>{
        selectedValidationFile && handleValidationReportsGet(project_id, id, sid, selectedValidationFile)
    },[selectedValidationFile])

    const handleValidationReportsGet = async (project_id, package_id, state_id, identifier = undefined) => {
        const data = { project_id, package_id, state_id, identifier }
        try {
            const result = await sectionApi.getSparqlReports(data)
            setValidationReport(mapSparqlResults(result));
            setDataLoad(false)

        } catch (err) {
            setDataLoad(false)
            console.error(err);
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
        return resultArray;
    })

    const itemsSearch = useItemsSearch(validationReport);

    return dataLoad ?
        <>
            <Skeleton width="20%"
                      height={80} />
            {
                new Array(5).fill("").map((e, i) =>
                <Skeleton key={i}
                          height={50}/>)
            }
        </> :
        !files?.length ?
            <Stack justifyContent="center"
                   direction="row">
                <Alert severity="info">No Data !</Alert>
            </Stack> :
            <>
                <Select
                    onChange={(e) => {
                        itemsSearch.handleFiltersChange()
                        setSelectedValidationFile(e.target.value)
                    }}
                    value={selectedValidationFile}>
                    {files?.map(file =>
                        <MenuItem key={file}
                                  value={file}>
                            {file}
                        </MenuItem>)}
                </Select>
                <QueryResultTable
                    items={validationReport}
                />
                <ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>
                <ListTable
                    items={itemsSearch.pagedItems}
                    count={itemsSearch.pagedItems?.length}
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    onSort={itemsSearch.handleSort}
                    sort={itemsSearch.state.sort}
                    sectionApi={sectionApi}
                />
            </>
}

export default SparqlValidationReport