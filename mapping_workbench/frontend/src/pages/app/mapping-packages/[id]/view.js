import {useState} from 'react';
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

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {RouterLink} from 'src/components/router-link';
import {useRouter} from "src/hooks/use-router";
import {useItem} from "src/contexts/app/section/for-item-data-state";
import {FileResourceCollectionsCard} from 'src/sections/app/file-manager/file-resource-collections-card'

import {PropertyList} from "../../../../components/property-list";
import {PropertyListItem} from "../../../../components/property-list-item";
import {shaclTestSuitesApi} from "../../../../api/shacl-test-suites";

import StatesView from "../../../../sections/app/mapping-package/state/states_view";
import MappingPackageRulesView from "../../../../sections/app/mapping-package/mapping-package-rules-view";
import TripleMapping from "../../../../sections/app/mapping-package/triple-mapping";

const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'Resources', value: 'resources'},
    {label: 'Mapping Rules', value: 'mappingRules'},
    {label: 'Triple Map Fragments', value: 'tripleMapFragments'},
    {label: 'States', value: 'states'}
];



const Page = () => {
    const [currentTab, setCurrentTab] = useState('details');

    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;

    if (!id) {
        return;
    }

    const { item } = useItem(sectionApi, id);

    const handleTabsChange = (event, value) => {
        setCurrentTab(value);
    }

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
                    <MappingPackageRulesView id={id}/>
                )}
                {currentTab === "tripleMapFragments" && (
                    <TripleMapping id={id}/>
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
