import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Unstable_Grid2';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {useRouter} from 'next/router';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from '../../../hooks/use-items-search';
import {useItemsStore} from '../../../hooks/use-items-store';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';
import {ListSearch} from "../../../sections/app/ontology-namespace/list-search";
import {ListTable} from "../../../sections/app/ontology-namespace/list-table";
import OntologyNamespacesCustom from '../ontology-namespaces-custom';

const TABS = [{label: 'Source Files', value: 'test_data_suites'}, {label: 'Ontology Files', value: 'ontology_files'},
    {label: 'Ontology Terms', value: 'ontology_terms'}, {label: 'Namespaces', value: 'ontology_namespaces'}]


const Page = () => {
    const router = useRouter()
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi);

    const handleTabsChange = (event, value) => {
        return router.push(paths.app[value].index)
    }

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Grid xs={12}>
                    <Tabs value={'ontology_namespaces'}
                          onChange={handleTabsChange}>
                        {TABS.map(tab => <Tab key={tab.value}
                                              label={tab.label}
                                              value={tab.value}/>)}
                    </Tabs>
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
                                    <PlusIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <ListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
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
