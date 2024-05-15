import {useEffect, useState} from "react";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {ListTable} from "./list-table";
import {FileCollectionListSearch} from "../../file-manager/file-collection-list-search";



const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {},
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE,
        sortField: "",
        sortDirection: undefined,
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
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
    };

    const handleRowsPerPageChange = (event) => {
        setState(prevState => ({
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
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getStates(id, searchState)
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count
                })
            )
            .catch(err => console.warn(err))
    }


    useEffect(() => {
            id && handleItemsGet()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, searchState]);

    return {
        ...state
    };
};

const StatesView = ({ id }) => {

    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(id, itemsSearch.state);

    return (
        <Card sx={{mt: 3}}>
            <CardContent>
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
                            sectionApi={sectionApi}
                        /> :
                    <Stack justifyContent="center"
                           direction="row">
                        <Alert severity="info">No Data !</Alert>
                    </Stack>
                }
            </CardContent>
        </Card>
    )
}

export default StatesView