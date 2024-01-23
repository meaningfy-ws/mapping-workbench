import {Layout as AppLayout} from "../../../../../layouts/app";
import {Seo} from "../../../../../components/seo";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {BreadcrumbsSeparator} from "../../../../../components/breadcrumbs-separator";
import Link from "@mui/material/Link";
import {RouterLink} from "../../../../../components/router-link";
import {paths} from "../../../../../paths";
import Card from "@mui/material/Card";
import {FileCollectionListSearch} from "../../../../../sections/app/file-manager/file-collection-list-search";
import {useCallback, useEffect, useState} from "react";
import {useMounted} from "../../../../../hooks/use-mounted";
import {usePageView} from "../../../../../hooks/use-page-view";
import {mappingPackageStatesApi as sectionApi} from "../../../../../api/mapping-packages/states";
import {useItem} from "../../../../../contexts/app/section/for-item-data-state";
import {useRouter} from "../../../../../hooks/use-router";
import {ListTable} from "../../../../../sections/app/mapping-package/state/list-table";


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

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters,
            page: 0
        }));
    }, []);

    const handlePageChange = useCallback((event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, []);

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
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
            console.log("searchState",searchState)

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
            handleItemsGet().then(response => {
                console.log("RESPONSE: ", response);
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

const Page = () => {

    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;

    if (!id) {
        return;
    }

    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(id, itemsSearch.state);

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
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
