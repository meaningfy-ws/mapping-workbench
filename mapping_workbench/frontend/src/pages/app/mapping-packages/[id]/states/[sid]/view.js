import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";


import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import exportPackage from "src/utils/export-mapping-package";
import {mappingPackagesApi as previousSectionApi} from 'src/api/mapping-packages';
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';

const StateDetails =
    dynamic(() => import("src/sections/app/mapping-package/state/state-details"),
        {loading: () => <Stack alignItems='center'><CircularProgress/></Stack>});
const XpathValidationReportView =
    dynamic(() => import("src/sections/app/xpath-validation-report/xpath_validation_report_view"),
        {loading: () => <Stack alignItems='center'><CircularProgress/></Stack>});
const SparqlValidationReport =
    dynamic(() => import("src/sections/app/sparql-validation-report/sparql_validation_report_view"),
        {loading: () => <Stack alignItems='center'><CircularProgress/></Stack>});
const ShaclValidationReport =
    dynamic(() => import("src/sections/app/shacl-validation-report/shacl_validation_report_view"),
        {loading: () => <Stack alignItems='center'><CircularProgress/></Stack>});

const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'XPath Reports', value: 'xpath'},
    {label: 'SPARQL Reports', value: 'sparql'},
    {label: 'SHACL Reports', value: 'shacl'},
];

const Page = () => {
    const router = useRouter();

    const {id, sid} = router.query;

    const [item, setItem] = useState({})
    const [currentTab, setCurrentTab] = useState('details');
    const [isExporting, setIsExporting] = useState()
    const [validationReportTree, setValidationReportTree] = useState([])

    useEffect(() => {
        if (sid) {
            handleItemsGet(sid);
            handleValidationReportTreeGet(sid)
        }
    }, [sid]);

    const handleItemsGet = (sid) => {
        sectionApi.getState(sid)
            .then(res => setItem(res))
            .catch(err => console.error(err))
    }

    const handleValidationReportTreeGet = (sid) => {
        sectionApi.getValidationReportTree(sid)
            .then(res => setValidationReportTree(res))
            .catch(err => console.error(err))
    }

    const handleTabsChange = (event, value) => setCurrentTab(value)

    const handleExport = (item) => {
        return exportPackage(sectionApi, id, setIsExporting, item)
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} View`}/>
            <Stack spacing={4}>
                <Stack spacing={4}>
                    <Stack direction="row"
                           justifyItems="center"
                           gap={1}>
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
                                <ArrowBackIcon/>
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                {previousSectionApi.SECTION_TITLE}
                            </Typography>
                        </Link>
                        /
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
                            <Typography variant="subtitle2">
                                States
                            </Typography>
                        </Link>
                    </Stack>
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
                            onClick={() => handleExport(item)}
                            disabled={isExporting}
                            startIcon={<FileDownloadIcon/>}
                            // variant="contained"

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
                                id={tab.value + '_reports_tab'}
                                label={tab.label}
                                value={tab.value}
                                disabled={!validationReportTree.test_data_suites?.length}
                            />
                        ))}
                    </Tabs>
                </Stack>
                {currentTab === 'details' && (
                    <StateDetails sid={sid}
                                  item={item}
                                  reportTree={validationReportTree}/>
                )}
                {currentTab === 'xpath' && (
                    <Card>
                        <CardContent>
                            <XpathValidationReportView
                                sid={sid}
                                reportTree={validationReportTree}
                            />
                        </CardContent>
                    </Card>
                )}
                {currentTab === 'sparql' && (
                    <Card>
                        <CardContent>
                            <SparqlValidationReport
                                sid={sid}
                                reportTree={validationReportTree}
                            />
                        </CardContent>
                    </Card>
                )}
                {currentTab === 'shacl' && (
                    <Card>
                        <CardContent>
                            <ShaclValidationReport
                                sid={sid}
                                reportTree={validationReportTree}
                            />
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
