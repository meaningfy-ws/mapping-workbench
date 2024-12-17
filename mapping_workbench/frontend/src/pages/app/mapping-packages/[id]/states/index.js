import {useEffect, useState} from "react";

import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import {paths} from "src/paths";
import {Seo} from "src/components/seo";
import {useRouter} from "src/hooks/use-router";
import {usePageView} from "src/hooks/use-page-view";
import {Layout as AppLayout} from "src/layouts/app";
import {RouterLink} from "src/components/router-link";
import useItemsSearch from 'src/hooks/use-items-search';
import {BreadcrumbsSeparator} from "src/components/breadcrumbs-separator";
import {ListTable} from "src/sections/app/mapping-package/state/list-table";
import {mappingPackagesApi as upperSectionApi} from "src/api/mapping-packages";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import {FileCollectionListSearch} from "src/sections/app/file-manager/file-collection-list-search";


const Page = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const router = useRouter();
    const itemsSearch = useItemsSearch(state.items,sectionApi);

    const {id} = router.query;

    const handleItemsGet = () => {
        sectionApi.getStates(id, itemsSearch.state)
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
    [id, itemsSearch.state]);

    usePageView();

    return(
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.SECTION_TITLE}
                        </Typography>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={1}
                        >
                            <Chip
                                label={id}
                                size="small"
                            />
                        </Stack>
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
                                sx={{
                                    alignItems: 'center',
                                    display: 'inline-flex'
                                }}
                                underline="hover"
                            >
                                <Typography variant="subtitle2">
                                    {upperSectionApi.SECTION_TITLE}
                                </Typography>
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
                    </Stack>
                </Stack>
                <Card>
                    <FileCollectionListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
                    <ListTable
                        items={state.items}
                        count={state.itemsCount}
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        onSort={itemsSearch.handleSort}
                        sortField={itemsSearch.state.sortField}
                        sortDirection={itemsSearch.state.sortDirection}
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
