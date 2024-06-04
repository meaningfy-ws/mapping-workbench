import {useEffect, useState} from 'react';

import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {schemaApi as sectionApi} from 'src/api/schema';
import {BasicDetails} from 'src/sections/app/fields-registry/basic-details';
import {RouterLink} from 'src/components/router-link';
import {usePageView} from 'src/hooks/use-page-view';
import {useRouter} from "src/hooks/use-router";

const tabs = [
    {label: 'Details', value: 'details'}
];

const Page = () => {
    const [currentTab, setCurrentTab] = useState('details');
    const [item, setItem] = useState()

    const router = useRouter();

    const {id} = router.query;

    useEffect(() => {
        id && sectionApi.getItem(id, 'element')
            .then(res => setItem(res))
            .catch(err => console.error(err))
    },[id]);

    usePageView();

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
                                {item.name && <Typography variant="h4">
                                    {item.name}
                                </Typography>}
                                <Typography variant={item.name ? "h5" : "h4"}>
                                    {item.sdk_element_id}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <div>
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
                    </div>
                </Stack>
                {currentTab === 'details' && (
                    <div>
                        <Grid
                            container
                            spacing={4}
                        >
                            <Grid
                                xs={12}
                                lg={12}
                            >
                                <BasicDetails
                                    item={item}
                                />
                            </Grid>
                        </Grid>
                    </div>
                )}
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
