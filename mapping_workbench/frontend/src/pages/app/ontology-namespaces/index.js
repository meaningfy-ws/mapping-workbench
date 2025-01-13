import AddIcon from '@mui/icons-material/Add';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {SourceAndTargetTabs} from 'src/sections/app/source-and-target';
import {TableSearchBar} from 'src/sections/components/table-search-bar';
import {ListTable} from "src/sections/app/ontology-namespace/list-table";
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';
import OntologyNamespacesCustom from 'src/pages/app/ontology-namespaces-custom';
import {NavigationTabsWrapper} from '../../../components/navigation-tabs-wrapper';

const Page = () => {
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['prefix', 'uri']);

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <NavigationTabsWrapper>
                <SourceAndTargetTabs/>
            </NavigationTabsWrapper>
            <Grid container
                  mt={5}
                  spacing={4}>
                <Grid xs={12}
                      xl={6}
                      item>
                    <Stack spacing={4}>
                        <Typography variant="h5">
                            {sectionApi.SECTION_TITLE}
                        </Typography>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Paper>
                                <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                                value={itemsSearch.state.search[0]}/>
                            </Paper>
                        </Stack>
                        <ListTable
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            items={itemsSearch.pagedItems}
                            count={itemsSearch.count}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            sort={itemsSearch.state.sort}
                            onSort={itemsSearch.handleSort}
                            sectionApi={sectionApi}
                        />
                    </Stack>
                </Grid>
                <Grid xs={12}
                      xl={6}>
                    <OntologyNamespacesCustom/>
                </Grid>
            </Grid>

        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
