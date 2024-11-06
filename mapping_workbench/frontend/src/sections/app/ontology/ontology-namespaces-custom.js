import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {RouterLink} from 'src/components/router-link';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {ListTable} from "src/sections/app/ontology-namespace-custom/list-table";
import {ontologyNamespacesCustomApi as sectionApi} from 'src/api/ontology-namespaces-custom';

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters: filters ? {q: filters} : {},
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

const useItemsStore = searchState => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems(searchState)
            .then(res => setState({
                items: res.items,
                itemsCount: res.count
            }))
            .catch(err => console.error(err))
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

const OntologyNamespacesCustom = () => {
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    return (
        <Stack spacing={4}>
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
            >
                <Stack spacing={1}>
                    <Typography variant="h5">
                        {sectionApi.SECTION_TITLE}
                    </Typography>
                </Stack>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={3}
                >
                    <Button
                        id="add_namespace_button"
                        component={RouterLink}
                        href={paths.app[sectionApi.section].create}
                        startIcon={(
                            <SvgIcon>
                                <AddIcon/>
                            </SvgIcon>
                        )}
                        variant="contained"
                    >
                        Add Namespace
                    </Button>
                </Stack>
            </Stack>
            <Card>
                <TableSearchBar onChange={itemsSearch.handleFiltersChange}
                                value={itemsSearch.state.filters.q}
                                placeholder='Search Namespaces'/>
                <Divider/>
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

export default OntologyNamespacesCustom;
