import {useEffect, useState} from 'react';
import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Autocomplete from "@mui/material/Autocomplete";
import TablePagination from "@mui/material/TablePagination";

import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from "../../../../components/router-link";
import {fieldsRegistryApi} from "../../../../api/fields-registry";
import CMCard from "../../../../sections/app/conceptual-mapping-rule/cm-card";
import {BreadcrumbsSeparator} from "../../../../components/breadcrumbs-separator";
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import {paths} from "../../../../paths";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {},
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const {show, ...filters} = state.filters

    const pagedItems = items.filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if ((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    }

    const handleRowsPerPageChange = (event) => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    return {
        handlePageChange,
        handleRowsPerPageChange,
        pagedItems,
        count: items.length,
        state
    };
};

const Page = () => {

    usePageView();

    const [isProjectDataReady, setIsProjectDataReady] = useState(false);
    const [structuralElements, setStructuralElements] = useState([]);
    const [selectedStructuralElement, setSelectedStructuralElement] = useState(null);
    const [structuralElement, setStructuralElement] = useState(null);
    const [cmStatuses, setCmStatuses] = useState([]);

    const [itemsStore, setItemsStore] = useState({
        items: [],
        itemsCount: 0
    });

    const getCMRules = (structural_element_id) => {
        const request = {
            rowsPerPage: -1,
            filters: {}
        };
        if (structural_element_id) {
            request.filters["source_structural_elements"] = [structural_element_id]
        }

        sectionApi.getItems(request)
            .then(res =>
                setItemsStore({
                    items: res.items,
                    itemsCount: res.count
                }))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getCMRules()
        sectionApi.getCMStatuses().then(res => {
            setCmStatuses(res)
        })
    }, []);

    const itemsSearch = useItemsSearch(itemsStore.items);

    useEffect(() => {
        (async () => {
            setStructuralElements(await fieldsRegistryApi.getStructuralElementsForSelector());
            setIsProjectDataReady(true);
        })()
    }, [])

    if (!isProjectDataReady) return null;

    const handleSourceStructuralElementSelect = (async (e, value) => {
        itemsSearch.state.page = 0
        setSelectedStructuralElement(value);
        setStructuralElement(value ? await fieldsRegistryApi.getItem(value.id, 'element') : null);
        getCMRules(value?.id)
    })


    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE}`}/>
            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4
                }}
            >
                <Grid xs={12}>
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            Review {sectionApi.SECTION_TITLE}
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
                                href={paths.app[sectionApi.section].review.index}
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
                </Grid>
                <Grid
                    xs={12}
                    md={12}
                >
                    <Stack
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <Autocomplete
                            fullWidth
                            options={structuralElements}
                            defaultValue={selectedStructuralElement}
                            onChange={handleSourceStructuralElementSelect}
                            renderInput={(params) =>
                                <TextField {...params}
                                           label="Structural Element"
                                />}
                        />
                        <TablePagination
                            component="div"
                            count={itemsSearch.count}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
                            showFirstButton
                            showLastButton
                        />

                        {itemsSearch.pagedItems.map(cm_rule => <CMCard
                            key={cm_rule._id}
                            cm_rule={cm_rule}
                            structural_element={structuralElement}
                            cm_statuses={cmStatuses}
                        />)}
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
