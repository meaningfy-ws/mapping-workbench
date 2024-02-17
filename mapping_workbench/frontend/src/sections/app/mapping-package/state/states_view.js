import {useCallback, useEffect, useState} from "react";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {
    mappingPackageStatesApi as sectionStatesApi,
    mappingPackageStatesApi as sectionApi
} from 'src/api/mapping-packages/states';
import {ListTable} from "./list-table";
import {FileCollectionListSearch} from "../../file-manager/file-collection-list-search";

const StatesView = ({ id }) => {

    const [filtersState, setFiltersState] = useState({
        filters: {},
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const [state, setState] = useState({
        dataLoad: true,
        items: [],
        itemsCount: 0
    });

    const [sort, setSort] = useState({
        field: "",
        direction: null
    })

    useEffect(() => {
            handleItemsGet()
        },
        [JSON.stringify(filtersState), JSON.stringify(sort)]
    );


    const handleFiltersChange = useCallback(filters => {
        setFiltersState(prevState => ({
            ...prevState,
            filters,
            page: 0
        }));
    },[])

    const handlePageChange = useCallback((event, page) => {
        setFiltersState(prevState => ({
            ...prevState,
            page
        }));
    },[])

    const handleRowsPerPageChange = useCallback(event => {
        setFiltersState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    },[])

    const handleSort = (field) => {
        console.log(field,sort,sort.direction > 0)
        if(sort.field === field)
            setSort(e => ({ field: e.field, direction: e.direction > 0 ? -1 : 1 }))
        else setSort({ field, direction: -1 })
    }

    const handleItemsGet = async () => {
        try {
            console.log(sort)
            const response = await sectionStatesApi.getStates(id,
                {...filtersState, sortField: sort.field, sortDirection: sort.direction});
                setState({
                    items: response.items,
                    itemsCount: response.count
                });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        state.dataLoad ?
            <>
                <Skeleton height={180} />
                {
                    new Array(5).fill("").map((e, i) =>
                    <Skeleton key={i}
                              height={50}/>)
                }
            </> :
        !state.items?.length ?
            <Stack justifyContent="center"
                   direction="row">
                <Alert severity="info">No Data !</Alert>
            </Stack> :
            <>
                <FileCollectionListSearch onFiltersChange={handleFiltersChange}/>
                <ListTable
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onSort={handleSort}
                    sort={sort}
                    page={filtersState?.page}
                    items={state.items}
                    count={state.itemsCount}
                    rowsPerPage={filtersState?.rowsPerPage}
                    sectionApi={sectionStatesApi}
                />
            </>
    )
}

export default StatesView