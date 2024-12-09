import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {SourceAndTargetTabs} from 'src/sections/app/source-and-target';
import {ListTable} from "src/sections/app/ontology-namespace/list-table";
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';
import OntologyNamespacesCustom from 'src/pages/app/ontology-namespaces-custom';
import {TableSearchBar} from '../../../sections/components/table-search-bar';

const Page = () => {
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['prefix','uri']);

    usePageView();

    console.log(itemsStore.items)
    console.log(itemsSearch)

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Grid xs={12}>
                    <SourceAndTargetTabs/>
                </Grid>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.SECTION_TITLE}
                        </Typography>
                        <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.index}
                                variant="subtitle2"
                            >
                                App
                            </Link>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.app[sectionApi.section].index}
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TITLE}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="add_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}/>
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
                </Card>
                <OntologyNamespacesCustom/>
            </Stack>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
