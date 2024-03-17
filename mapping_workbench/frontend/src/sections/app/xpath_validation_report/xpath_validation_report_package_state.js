import {useEffect, useState} from "react";

import Typography from "@mui/material/Typography";

import {CoverageFilter, TableLoadWrapper} from "./utils";
import {ListTable} from "./list-table";
import CoverageReport from "./coverage_report";
import ItemSearchInput from "../file-manager/item-search-input";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";

const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
            is_covered: ""
        },
        sort: {
        },
        search: [],
        searchColumns:["eforms_sdk_element_id","test_data_xpath"],
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
            if(value !== undefined && typeof item[key] === "string" && !item[key].toLowerCase().includes(value.toLowerCase))
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

const XpathValidationReport = ({ sid, files, mappingSuiteIdentifier }) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataLoad, setDataLoad] = useState(true)

    useEffect(()=>{
        handleValidationReportsGet(sid)
    },[])

    const handleValidationReportsGet = async (sid) => {
        try {
            const result = await sectionApi.getXpathReports(sid)
            setValidationReport(result.results.map(e => ({...e, notice_count: e.test_data_xpaths.length})))
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoad(false)
        }
    }

    const itemsSearch = useItemsSearch(validationReport);
    const handleCoverageFilterChange = e => {
        itemsSearch.handleFiltersChange({is_covered: e.target.value})
    }

    return (
        <>
            <Typography m={2}
                        variant="h4">
                    Summary
            </Typography>
            <TableLoadWrapper load={dataLoad}
                       data={validationReport}
                       lines={3}>
                <CoverageReport validationReport={validationReport}
                                mappingSuiteIdentifier={mappingSuiteIdentifier}/>
            </TableLoadWrapper>

            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <TableLoadWrapper load={dataLoad}
                              data={validationReport}>
                <ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>
                <CoverageFilter onChange={handleCoverageFilterChange}
                                filterState={itemsSearch.state.filters.is_covered}/>
                    <ListTable
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
export default  XpathValidationReport