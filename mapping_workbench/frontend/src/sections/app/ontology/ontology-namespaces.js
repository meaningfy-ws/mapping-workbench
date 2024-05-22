import {useEffect, useState} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {usePageView} from 'src/hooks/use-page-view';
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';
import {ListSearch} from "src/sections/app/ontology-namespace/list-search";
import {ListTable} from "src/sections/app/ontology-namespace/list-table";

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        sortField: '',
        sortDirection: undefined,
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
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
    }

    const handleRowsPerPageChange = event => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

const useItemsStore = (searchState) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
       sectionApi.getItems(searchState)
           .then(res =>
               setState({
                    items: res.items,
                    itemsCount: res.count
                }))
           .catch(err => console.warn(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

const OntologyNamespaces = () => {
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    usePageView();

    return (
        <Stack spacing={5}>
            <Typography variant="h5">
                Discovered Namespaces
            </Typography>
            <Card>
                <ListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
                <ListTable
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    items={itemsStore.items}
                    count={itemsStore.itemsCount}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    sectionApi={sectionApi}
                />
            </Card>
        </Stack>
    )
};

export default OntologyNamespaces;
