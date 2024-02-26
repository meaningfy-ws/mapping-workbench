import {useCallback, useEffect, useState} from 'react';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {mappingPackageStatesApi as sectionStatesApi} from 'src/api/mapping-packages/states';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {useRouter} from "src/hooks/use-router";
import {useItem} from "src/contexts/app/section/for-item-data-state";
import {FileResourceCollectionsCard} from 'src/sections/app/file-manager/file-resource-collections-card'
import {PropertyList} from "../../../../components/property-list";
import {PropertyListItem} from "../../../../components/property-list-item";
import {shaclTestSuitesApi} from "../../../../api/shacl-test-suites";

import {ListTable as MappingRulesListTable} from "src/sections/app/conceptual-mapping-rule/list-table";
import {conceptualMappingRulesApi} from "../../../../api/conceptual-mapping-rules";
import {useMounted} from "../../../../hooks/use-mounted";
import {ListSearch as MappingRulesListSearch} from "src/sections/app/conceptual-mapping-rule/list-search";
import {ListSelectorSelect as ResourceListSelector} from "../../../../components/app/list-selector/select";
import {specificTripleMapFragmentsApi} from "../../../../api/triple-map-fragments/specific";
import toast from "react-hot-toast";

import {FileCollectionListSearch} from "../../../../sections/app/file-manager/file-collection-list-search";
import {ListTable} from "../../../../sections/app/mapping-package/state/list-table";
import StatesView from "../../../../sections/app/mapping-package/state/states_view";

const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'Resources', value: 'resources'},
    {label: 'Mapping Rules', value: 'mappingRules'},
    {label: 'Triple Map Fragments', value: 'tripleMapFragments'},
    {label: 'States', value: 'states'}
];


const useMappingRulesSearch = () => {
    const [state, setState] = useState({
        filters: {
            q: undefined,
            terms_validity: undefined,
        },
        page: conceptualMappingRulesApi.DEFAULT_PAGE,
        rowsPerPage: conceptualMappingRulesApi.DEFAULT_ROWS_PER_PAGE,
        detailedView: true
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters,
            //page: 0
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

    const handleDetailedViewChange = useCallback((event, detailedView) => {
        setState((prevState) => ({
            ...prevState,
            detailedView
        }));
    }, []);

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleDetailedViewChange,
        state
    };
};

const useMappingRulesStore = (searchState, mappingPackage) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const request = searchState;
            request['filters']['mapping_packages'] = [mappingPackage];
            const response = await conceptualMappingRulesApi.getItems(request);
            if (isMounted()) {
                setState({
                    items: response.items,
                    itemsCount: response.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [conceptualMappingRulesApi, searchState, mappingPackage, isMounted]);

    useEffect(() => {
        handleItemsGet();
    }, [searchState]);

    return {
        handleItemsGet, ...state
    };
};

const Page = () => {
    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;

    if (!id) {
        return;
    }
    const [stateItemsStore, setStateItemsStore] = useState({itemsStateSearch:{}, itemsStateStore:{}})

    const formState = useItem(sectionApi, id);
    const item = formState.item;

    usePageView();
    const [currentTab, setCurrentTab] = useState('details');

    const mappingRulesSearch = useMappingRulesSearch();
    const mappingRulesStore = useMappingRulesStore(mappingRulesSearch.state, id);

    const [tripleMapFragments, setTripleMapFragments] = useState([]);

    useEffect(() => {
        (async () => {
            setTripleMapFragments((await specificTripleMapFragmentsApi.getValuesForSelector({
                filters: {
                    mapping_package: id
                }
            })).map(x => x.id))
        })()
    }, [specificTripleMapFragmentsApi, id])

    const handleTabsChange = useCallback((event, value) => {
        setCurrentTab(value);
    }, []);

    const handlePackagesUpdate = useCallback((event, value) => {
        mappingRulesStore.handleItemsGet();
    }, [mappingRulesStore]);

    const handleTripleMapFragmentsUpdate = useCallback(async () => {
        await specificTripleMapFragmentsApi.update_specific_mapping_package(id, tripleMapFragments);
        toast.success(specificTripleMapFragmentsApi.SECTION_TITLE + ' updated');
    }, [specificTripleMapFragmentsApi, id, tripleMapFragments]);

    const handleViewStatesAction = useCallback(async () => {
        router.push({
            pathname: paths.app[sectionApi.section].states.index,
            query: {id: id}
        });

    }, [router]);

    if (!item) {
        return;
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} View`}/>
            <Stack spacing={4}>
                <Stack spacing={4}>
                    <div>
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
                            <SvgIcon sx={{mr: 1}}>
                                <ArrowLeftIcon/>
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Link>
                    </div>
                    <Stack
                        alignItems="flex-start"
                        direction={{
                            xs: 'column',
                            md: 'row'
                        }}
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    {item.title}
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Chip
                                        label={item._id}
                                        size="small"
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        sx={{mt: 3}}
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
                    <Divider/>
                </Stack>
                {currentTab === 'details' && (
                    <Grid container
                          spacing={3}>
                        <Grid md={12}
                              xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid
                                        item={item}
                                        md={12}
                                        xs={12}
                                    >
                                        <PropertyList>
                                            <PropertyListItem
                                                label="Description"
                                                value={item.description}
                                                sx={{
                                                    whiteSpace: "pre-wrap",
                                                    px: 3,
                                                    py: 1.5
                                                }}
                                            />
                                            <Divider/>
                                            <Grid container
                                                  spacing={3}>
                                                <Grid md={6}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="Identifier"
                                                        value={item.identifier}
                                                    />
                                                </Grid>
                                                <Grid md={12}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="Mapping Version"
                                                        value={item.mapping_version}
                                                    />
                                                </Grid>
                                                <Grid md={12}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="EPO Version"
                                                        value={item.epo_version}
                                                    />
                                                </Grid>
                                                <Grid md={12}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="eForms Subtype"
                                                        value={item.eform_subtypes.join(', ')}
                                                    />
                                                </Grid>
                                                <Grid md={12}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="Start Date"
                                                        value={item.start_date}
                                                    />
                                                </Grid>
                                                <Grid md={12}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="End Date"
                                                        value={item.end_date}
                                                    />
                                                </Grid>
                                                <Grid md={12}
                                                      xs={12}>
                                                    <PropertyListItem
                                                        label="eForms SDK version"
                                                        value={item.eforms_sdk_versions.join(', ')}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </PropertyList>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
                {currentTab === 'resources' && (
                    <Grid container
                          spacing={3}>
                        {/*<Grid md={12} xs={12}>*/}
                        {/*    <FileResourceCollectionsCard*/}
                        {/*        collectionApi={testDataSuitesApi}*/}
                        {/*        filters={{*/}
                        {/*            ids: ((item.test_data_suites || []).length > 0*/}
                        {/*                && item.test_data_suites.map(x => x.id)) || ''*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid md={12} xs={12}>*/}
                        {/*    <FileResourceCollectionsCard*/}
                        {/*        collectionApi={sparqlTestSuitesApi}*/}
                        {/*        filters={{*/}
                        {/*            ids: ((item.sparql_test_suites || []).length > 0*/}
                        {/*                && item.sparql_test_suites.map(x => x.id)) || ''*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        <Grid md={12}
                              xs={12}>
                            <FileResourceCollectionsCard
                                collectionApi={shaclTestSuitesApi}
                                filters={{
                                    ids: ((item.shacl_test_suites || []).length > 0
                                        && item.shacl_test_suites.map(x => x.id)) || ''
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
                {currentTab === "mappingRules" && (
                    <>
                        <MappingRulesListSearch
                            onFiltersChange={mappingRulesSearch.handleFiltersChange}
                            onDetailedViewChange={mappingRulesSearch.handleDetailedViewChange}
                            detailedView={mappingRulesSearch.state.detailedView}
                        />
                        <MappingRulesListTable
                            onPageChange={mappingRulesSearch.handlePageChange}
                            onRowsPerPageChange={mappingRulesSearch.handleRowsPerPageChange}
                            page={mappingRulesSearch.state.page}
                            items={mappingRulesStore.items}
                            count={mappingRulesStore.itemsCount}
                            rowsPerPage={mappingRulesSearch.state.rowsPerPage}
                            sectionApi={conceptualMappingRulesApi}
                            onPackagesUpdate={handlePackagesUpdate}
                            detailedView={mappingRulesSearch.state.detailedView}
                        />
                    </>
                )}
                {currentTab === "tripleMapFragments" && (
                    <Card sx={{mt: 3}}>
                        <CardHeader title="RML Triple Maps"/>
                        <CardContent sx={{pt: 0}}>
                            <Grid container
                                  spacing={3}>
                                <Grid xs={12}
                                      md={12}>
                                    <ResourceListSelector
                                        valuesApi={specificTripleMapFragmentsApi}
                                        listValues={tripleMapFragments}
                                        titleField="uri"
                                    />
                                    <FormControl>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            onClick={handleTripleMapFragmentsUpdate}
                                        >
                                            Update
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
                {currentTab === "states" && (
                    <Card sx={{mt: 3}}>
                        <CardContent>
                            <Grid container
                                  spacing={3}>
                                <Grid xs={12}
                                      md={12}>
                                    <Card>
                                        <StatesView id={id}/>
                                    </Card>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
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
