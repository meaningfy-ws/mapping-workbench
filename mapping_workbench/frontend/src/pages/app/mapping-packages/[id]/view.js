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

import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {useRouter} from "src/hooks/use-router";
import {useItem} from "src/contexts/app/section/for-item-data-state";
import {testDataSuitesApi} from 'src/api/test-data-suites';
import {sparqlTestSuitesApi} from 'src/api/sparql-test-suites';
import {FileResourceCollectionsCard} from 'src/sections/app/file-manager/file-resource-collections-card'
import {PropertyList} from "../../../../components/property-list";
import {PropertyListItem} from "../../../../components/property-list-item";
import {shaclTestSuitesApi} from "../../../../api/shacl-test-suites";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {ListTable as MappingRulesListTable} from "src/sections/app/conceptual-mapping-rule/list-table";
import {conceptualMappingRulesApi} from "../../../../api/conceptual-mapping-rules";
import {useMounted} from "../../../../hooks/use-mounted";
import {ListSearch} from "../../../../sections/app/conceptual-mapping-rule/list-search";
import CardHeader from "@mui/material/CardHeader";
import {ListSelectorSelect as ResourceListSelector} from "../../../../components/app/list-selector/select";
import {specificTripleMapFragmentsApi} from "../../../../api/triple-map-fragments/specific";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'Resources', value: 'resources'},
    {label: 'Mapping Rules', value: 'mappingRules'},
    {label: 'Triple Map Fragments', value: 'tripleMapFragments'}
];

const useMappingRulesSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: 0,
        rowsPerPage: 5
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters
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

const useMappingRulesStore = (filters = {}) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const request = {
                filters: filters
            }

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
    }, [conceptualMappingRulesApi, filters, isMounted]);

    useEffect(() => {
        handleItemsGet();
    }, []);

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

    const formState = useItem(sectionApi, id);
    const item = formState.item;

    usePageView();
    const [currentTab, setCurrentTab] = useState('details');

    const mappingRulesSearch = useMappingRulesSearch();
    const mappingRulesStore = useMappingRulesStore({
        mapping_packages: [id]
    });

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
                    <Grid container spacing={3}>
                        <Grid md={12} xs={12}>
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
                                            <Grid container spacing={3}>
                                                <Grid md={6} xs={12}>
                                                    <PropertyListItem
                                                        label="Identifier"
                                                        value={item.identifier}
                                                    />
                                                </Grid>
                                                <Grid md={6} xs={12}>
                                                    <PropertyListItem
                                                        label="Sub-type"
                                                        value={item.subtype.join(', ')}
                                                    />
                                                </Grid>
                                                <Grid md={6} xs={12}>
                                                    <PropertyListItem
                                                        label="Start Date"
                                                        value={item.start_date}
                                                    />
                                                </Grid>
                                                <Grid md={6} xs={12}>
                                                    <PropertyListItem
                                                        label="End Date"
                                                        value={item.end_date}
                                                    />
                                                </Grid>
                                                <Grid md={6} xs={12}>
                                                    <PropertyListItem
                                                        label="Min XSD Version"
                                                        value={item.min_xsd_version}
                                                    />
                                                </Grid>
                                                <Grid md={6} xs={12}>
                                                    <PropertyListItem
                                                        label="Max XSD Version"
                                                        value={item.max_xsd_version}
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
                    <Grid container spacing={3}>
                        <Grid md={12} xs={12}>
                            <FileResourceCollectionsCard
                                collectionApi={testDataSuitesApi}
                                filters={{
                                    ids: ((item.test_data_suites || []).length > 0
                                        && item.test_data_suites.map(x => x.id)) || ''
                                }}
                            />
                        </Grid>
                        <Grid md={12} xs={12}>
                            <FileResourceCollectionsCard
                                collectionApi={sparqlTestSuitesApi}
                                filters={{
                                    ids: ((item.sparql_test_suites || []).length > 0
                                        && item.sparql_test_suites.map(x => x.id)) || ''
                                }}
                            />
                        </Grid>
                        <Grid md={12} xs={12}>
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
                        <ListSearch onFiltersChange={mappingRulesSearch.handleFiltersChange}/>
                        <MappingRulesListTable
                            onPageChange={mappingRulesSearch.handlePageChange}
                            onRowsPerPageChange={mappingRulesSearch.handleRowsPerPageChange}
                            page={mappingRulesSearch.state.page}
                            items={mappingRulesStore.items}
                            count={mappingRulesStore.itemsCount}
                            sectionApi={conceptualMappingRulesApi}
                            onPackagesUpdate={handlePackagesUpdate}
                        />
                    </>
                )}
                {currentTab === "tripleMapFragments" && (
                    <Card sx={{mt: 3}}>
                        <CardHeader title="RML Triple Maps"/>
                        <CardContent sx={{pt: 0}}>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={12}>
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
