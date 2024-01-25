import {useCallback, useEffect, useState} from 'react';
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
import Button from "@mui/material/Button";

import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {mappingPackagesApi as previousSectionApi} from 'src/api/mapping-packages';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {useRouter} from "src/hooks/use-router";
import {PropertyList} from "../../../../../../components/property-list";
import {PropertyListItem} from "../../../../../../components/property-list-item";

import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {Upload04 as ExportIcon} from "@untitled-ui/icons-react/build/esm";

import {sessionApi} from "../../../../../../api/session";
import toast from "react-hot-toast";


const tabs = [
    {label: 'Details', value: 'details'}
];

const Page = () => {
    const router = useRouter();

    const [currentTab, setCurrentTab] = useState('details');
    const [item, setItem] = useState()
    const [isExporting, setIsExporting] = useState()

    const {id,sid} = router.query;

    if (!router.isReady) return;
    if (!id || !sid) {
        return;
    }

    useEffect(() => {
        handleItemsGet(sid);
    }, []);
    const handleItemsGet = async (sid) => {
        try {
            const response = await sectionApi.getState(sid);
            return  setItem(response);
        } catch (err) {
            console.error(err);
        }
    }

    usePageView();


    const handleTabsChange = useCallback((event, value) => {
        setCurrentTab(value);
    }, []);

    const handleExport = (item) => {
        setIsExporting(true)
        const data = {
            package_id: id,
            project_id: sessionApi.getSessionProject(),
            state_id: item._id
        }
        toast.promise(sectionApi.exportPackage(data), {
            loading: `Exporting "${item.identifier}" ... This may take a while. Please, be patient.`,
            success: (response) => {
                setIsExporting(false);
                saveAs(new Blob([response], {type: "application/x-zip-compressed"}), `${item.identifier} ${item._id}.zip`);
                return `"${item.identifier}" successfully exported.`
            },
            error: (err) => {
                setIsExporting(false);
                return `Exporting "${item.identifier}" failed: ${err.message}.`
            }
        })
    };

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
                            href={paths.app[sectionApi.section].view.replace("[id]", id)}
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
                                {previousSectionApi.SECTION_TITLE}
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
                        <Button
                            onClick={()=>handleExport(item)}
                            disabled={isExporting}
                            startIcon={(
                                <SvgIcon>
                                    <ExportIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            {isExporting ? "Exporting..." : "Export State"}
                        </Button>
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
                                                        value={item.eform_subtypes?.join(', ')}
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
                                                        value={item.eforms_sdk_versions?.join(', ')}
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
