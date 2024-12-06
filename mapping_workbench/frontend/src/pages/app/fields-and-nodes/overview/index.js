import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {Filter} from 'src/sections/components/filter';
import useItemsSearch from 'src/hooks/use-items-search';
import {ListTable} from 'src/sections/app/fields-registry/list-table';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {fieldsOverviewApi as sectionApi} from 'src/api/fields-overview';
import {ElementsDefinitionTabs} from 'src/sections/app/elements-definition';

const FILTER_VALUE = [
    {label: 'All', value: ''},
    {label: 'Node', value: 'node'},
    {label: 'Field', value: 'field'}
]

const SEARCH_COLUMNS = ["sdk_element_id", "relative_xpath", "absolute_xpath"];

const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems({}, null, '/fields_registry/elements')
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
        []);

    return {
        ...state
    };
};


const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, SEARCH_COLUMNS, {element_type: ''});

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack>
                    <ElementsDefinitionTabs/>
                </Stack>

                <Stack
                    alignItems="center"
                    justifyContent='end'
                    direction="row"
                    spacing={3}
                >
                    <Button
                        component={RouterLink}
                        href={paths.app.fields_and_nodes.overview.elements.create}
                        id="add-field-button"
                        startIcon={(
                            <AddIcon/>
                        )}
                        variant="contained"
                    >
                        Add
                    </Button>
                    <Button
                        id="import_shema_button"
                        component={RouterLink}
                        href={paths.app.fields_and_nodes.overview.import}
                        startIcon={(
                            <UploadIcon/>
                        )}
                        variant="contained"
                    >
                        Import schema from github
                    </Button>

                </Stack>
                <Card>
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}/>
                    <Divider/>
                    <Filter values={FILTER_VALUE}
                            value={itemsSearch.state.filters.element_type}
                            onValueChange={e => itemsSearch.handleFiltersChange({element_type: e})}/>
                    <Divider/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        sort={itemsSearch.state.sort}
                        onSort={itemsSearch.handleSort}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsStore.itemsCount}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                    />
                </Card>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
