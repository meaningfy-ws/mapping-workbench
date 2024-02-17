import {useCallback, useEffect, useState} from "react";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {
    mappingPackageStatesApi as sectionStatesApi,
    mappingPackageStatesApi as sectionApi
} from 'src/api/mapping-packages/states';
import {ListTable} from "./list-table";
import {FileCollectionListSearch} from "../../file-manager/file-collection-list-search";
import {useMounted} from "../../../../hooks/use-mounted";



const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {},
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE,
        sortField: "",
        sortDirection: undefined,
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters,
            page: 0
        }));
    }, []);

    const handlePageChange = (event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    };

    const handleRowsPerPageChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    };

    const handleSort = (sortField) => {
        if(state.sortField === sortField)
            setState(prevState => ({ ...prevState, sortDirection: prevState.sortDirection > 0 ? -1 : 1 }))
        else setState(prevState => ({ ...prevState, sortField, sortDirection: -1 }))
    }

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        state
    };
};


const useItemsStore = (id, searchState) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const response = await sectionApi.getStates(id, searchState);
            if (isMounted()) {
                setState({
                    items: response.items,
                    itemsCount: response.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);


    useEffect(() => {
            handleItemsGet()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

const StatesView = ({ id }) => {

    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(id, itemsSearch.state);

    return (
        <>
            <FileCollectionListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
            {
                itemsStore.itemsCount ?
                    <ListTable
                    id={id}
                    items={itemsStore.items}
                    count={itemsStore.itemsCount}
                    itemsSearch={itemsSearch}
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    onSort={itemsSearch.handleSort}
                    sortField={itemsSearch.state.sortField}
                    sortDirection={itemsSearch.state.sortDirection}
                    page={itemsSearch?.state?.page}
                    rowsPerPage={itemsSearch?.state?.rowsPerPage}
                    sectionApi={sectionStatesApi}
                /> :
                <Stack justifyContent="center"
                       direction="row">
                    <Alert severity="info">No Data !</Alert>
                </Stack>
            }
        </>
    )
}

export default StatesView