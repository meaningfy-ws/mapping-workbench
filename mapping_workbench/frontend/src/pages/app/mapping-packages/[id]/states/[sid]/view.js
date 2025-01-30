import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import exportPackage from "src/utils/export-mapping-package";
import {mappingPackagesApi as previousSectionApi} from 'src/api/mapping-packages';
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {mapShaclResults, mapSparqlResults} from 'src/sections/app/mapping-package/state/utils';

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
    {label: 'Coverage (XPath)', value: 'xpath'},
    {label: 'Correctness (SPARQL)', value: 'sparql'},
    {label: 'Compliance (SHACL)', value: 'shacl'},
];

const Page = () => {
    const router = useRouter();

    const {id, sid} = router.query;

    const [item, setItem] = useState({})
    const [currentTab, setCurrentTab] = useState('details');
    const [validationReportTree, setValidationReportTree] = useState([])
    const [validationReport, setValidationReport] = useState({})

    useEffect(() => {
        if (sid) {
            handleItemsGet(sid);
            handleValidationReportTreeGet(sid)
            resultSummaryXPATHGet(sid)
            resultSummarySPARQLGet(sid)
            resultSummarySHACLGet(sid)
        }
    }, [sid]);


    const resultSummarySPARQLGet = (sid) => {
        sectionApi.getSparqlReports(sid)
            .then(res => setValidationReport(prev => ({...prev, sparql: mapSparqlResults(res.summary ?? [])})))
            .catch(err => console.error(err))
    }

    const resultSummaryXPATHGet = (sid) => {
        sectionApi.getXpathReports(sid)
            .then(res => {
                setValidationReport(prev => ({
                    ...prev,
                    xpath: res.results.map(e => ({...e, notice_count: e.test_data_xpaths.length}))
                }))
            })
            .catch(err => console.error(err))
    }


    const resultSummarySHACLGet = (sid) => {
        sectionApi.getShaclReports(sid)
            .then(res => setValidationReport(prev => ({...prev, shacl: mapShaclResults(res.summary ?? [])})))
            .catch(err => console.error(err))
    }

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

    const handleExport = (setIsExporting) => exportPackage(sectionApi, id, setIsExporting, item)

    const disabledTabs = {
        xpath: !validationReport.xpath?.length,
        sparql: !validationReport.sparql?.length,
        shacl: !validationReport.shacl?.length,
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
                                disabled={!validationReportTree.test_data_suites?.length || disabledTabs[tab.value]}
                            />
                        ))}
                    </Tabs>
                </Stack>
                {currentTab === 'details' && (
                    <StateDetails sid={sid}
                                  handleChangeTab={setCurrentTab}
                                  item={item}
                                  validationReport={validationReport}/>
                )}
                {currentTab === 'xpath' && (
                    <XpathValidationReportView
                        sid={sid}
                        handleExport={handleExport}
                        validationReport={validationReport.xpath}
                        reportTree={validationReportTree}
                    />
                )}
                {currentTab === 'sparql' && (
                    <SparqlValidationReport
                        sid={sid}
                        handleExport={handleExport}
                        validationReport={validationReport.sparql}
                        reportTree={validationReportTree}
                    />
                )}
                {currentTab === 'shacl' && (
                    <ShaclValidationReport
                        sid={sid}
                        handleExport={handleExport}
                        validationReport={validationReport.shacl}
                        reportTree={validationReportTree}
                    />
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
