import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

import ArrowBack from '@mui/icons-material/ArrowBack';

import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import MappingPackageDetails from "src/sections/app/mapping-package/details";

const Assets =
    dynamic(() => import("src/sections/app/mapping-package/resources"));
const MappingPackageRulesView =
    dynamic(() => import("src/sections/app/mapping-package/mapping-package-rules-view"));
const TripleMapping =
    dynamic(() => import("src/sections/app/mapping-package/triple-mapping"));
const StatesView =
    dynamic(() => import("src/sections/app/mapping-package/state/states_view"));


const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'Assets', value: 'assets'},
    {label: 'Mapping Rules', value: 'mappingRules'},
    {label: 'Triple Map Fragments', value: 'tripleMapFragments'},
    {label: 'States', value: 'states'}
];

const Page = () => {
    const [currentTab, setCurrentTab] = useState('details');
    const [item, setItem] = useState()

    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        id && sectionApi.getItem(id)
            .then(res => setItem(res))
    }, [id]);

    const handleTabsChange = (event, value) => setCurrentTab(value);

    if (!item)
        return

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} View`}/>
            <Stack spacing={4}>
                <Stack spacing={4}>
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
                            <ArrowBack sx={{mr: 1}}/>
                            <Typography variant="subtitle2">
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Link>
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
                                <Typography variant="h5">
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
                    <MappingPackageDetails item={item}/>
                )}
                {currentTab === 'assets' && (
                    <Assets item={item}/>
                )}
                {currentTab === "mappingRules" && (
                    <MappingPackageRulesView id={id}/>
                )}
                {currentTab === "tripleMapFragments" && (
                    <TripleMapping id={id}/>
                )}
                {currentTab === "states" && (
                    <StatesView id={id}/>
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
