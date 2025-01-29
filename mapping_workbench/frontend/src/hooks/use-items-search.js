import {useState} from "react";

const useItemsSearch = (items, sectionApi, searchColumns, newFilters, sort) => {
    const [state, setState] = useState({
        search: [],
        filters: newFilters ?? {},
        sort: sort ?? {
            column: "",
            direction: "desc"
        },
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const {show, ...filters} = state.filters

    const searchItems = state.search.length ? items.filter(item => {
        let returnItem = null;
        searchColumns.forEach(column => {
            state.search.forEach(search => {
                if (item[column]?.toLowerCase()?.includes(search.toLowerCase()))
                    returnItem = item
            })
        })
        return returnItem
    }) : items


    const filteredItems = searchItems.filter((item) => {
        let returnItem = item;
        Object.entries(filters).forEach(filter => {
            const [key, value] = filter
            if (value !== "" && value !== undefined && typeof item[key] === "boolean" && item[key] !== (value == "true"))
                returnItem = null
            if (value !== "" && value !== undefined && typeof item[key] === "string" && !item[key].toLowerCase().includes(value.toLowerCase()))
                returnItem = null
        })
        return returnItem
    })


    const sortedItems = () => {
        const sortColumn = state.sort.column
        if (!sortColumn) {
            return filteredItems
        } else {
            return filteredItems.sort((a, b) => {
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
        if ((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (search) => {
        setState(prevState => ({...prevState, search, page: 0}))
    }

    const handleFiltersChange = (filters) => {
        setState(prevState => ({...prevState, filters, page: 0}));
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({...prevState, page}));
    }

    const handleSort = (column) => {
        setState(prevState => ({
            ...prevState, sort: {
                column,
                direction: prevState.sort.column === column && prevState.sort.direction === "asc" ? "desc" : "asc"
            }
        }))
    }
    const handleRowsPerPageChange = (event) => {
        setState(prevState => ({...prevState, rowsPerPage: parseInt(event.target.value, 10)}));
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

export default useItemsSearch