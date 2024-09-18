import {useState} from 'react';

import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import {useItem} from "src/contexts/app/section/for-item-data-state";
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';
import {BasicDetails} from 'src/sections/app/ontology-namespace/basic-details';

const tabs = [
    {label: 'Details', value: 'details'}
];

const Page = () => {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState('details');

    usePageView();
    const {id} = router.query;

    const formState = useItem(sectionApi, id);
    const item = formState.item;

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
                            href={paths.app.ontology_terms.index}
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
                                    {item.prefix}
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
                            {tabs.map(tab => (
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
                                    id={item._id}
                                    prefix={item.prefix}
                                    uri={item.uri}
                                    is_syncable={item.is_syncable}
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
