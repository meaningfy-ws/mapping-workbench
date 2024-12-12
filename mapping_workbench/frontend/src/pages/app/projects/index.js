import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useProjects} from "src/hooks/use-projects";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {projectsApi as sectionApi} from 'src/api/projects';
import {ListTable} from 'src/sections/app/project/list-table';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {TableSearchBar} from '../../../sections/components/table-search-bar';


export const Page = () => {
    const itemsStore = useProjects();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ["title", "description"]);

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack spacing={1}>
                    <Typography variant="h5">
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
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            {sectionApi.SECTION_TITLE}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Card>
                        <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                        value={itemsSearch.state.search[0]}
                        placeholder='Search by Project Title'/>
                    </Card>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="add_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={<AddIcon/>}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        onSort={itemsSearch.handleSort}
                        sort={itemsSearch.state.sort}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsSearch.count}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                    />
                </Card>
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
