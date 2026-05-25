import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import exportPackage from "src/utils/export-mapping-package";
import {mappingPackagesApi as previousSectionApi} from 'src/api/mapping-packages';
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {mapShaclResults, mapSparqlResults} from 'src/sections/app/mapping-package/state/utils';
import {DataLoader} from "../../../../../../components/app/loading/data-loader";

const StateDetails =
    dynamic(() => import("src/sections/app/mapping-package/state/state-details"),
        {loading: () => <DataLoader/>});
const XpathValidationReportView =
    dynamic(() => import("src/sections/app/xpath-validation-report/xpath_validation_report_view"),
        {loading: () => <DataLoader/>});
const SparqlValidationReport =
    dynamic(() => import("src/sections/app/sparql-validation-report/sparql_validation_report_view"),
        {loading: () => <DataLoader/>});
const ShaclValidationReport =
    dynamic(() => import("src/sections/app/shacl-validation-report/shacl_validation_report_view"),
        {loading: () => <DataLoader/>});


const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'Coverage (XPath)', value: 'xpath'},
    {label: 'Correctness (SPARQL)', value: 'sparql'},
    {label: 'Compliance (SHACL)', value: 'shacl'},
];

const Page = () => {
    const router = useRouter();
    const {id, sid, tab} = router.query;

    const [item, setItem] = useState({})
    const [validationReportTree, setValidationReportTree] = useState([])
    const [validationReport, setValidationReport] = useState({
        xpath: null,
        shacl: null,
        sparql: null
    })

    useEffect(() => {
        if (sid) {
            handleItemsGet(sid);
            handleValidationReportTreeGet(sid)
            resultSummaryXPATHGet(sid);
            resultSummarySPARQLGet(sid);
            resultSummarySHACLGet(sid);
            //resultReportsGet(sid);
        }
    }, [sid]);

    const resultReportsGet = (sid) => {
        sectionApi.getReports(sid)
            .then(res => {
                setValidationReport(prev => ({
                    ...prev,
                    sparql: mapSparqlResults(res.sparql?.summary ?? []),
                    xpath: res.xpath && res.xpath.results ? res.xpath.results.map(
                        e => ({...e, notice_count: e.test_data_xpaths.length})
                    ) : [],
                    shacl: mapShaclResults(res.shacl?.summary ?? [])
                }));
                setValidationReportTree(res.validation_reports_tree)
            })
            .catch(err => console.error(err))
    }

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

    const handleTabsChange = (event, value) =>
        router.push({
            pathname: paths.app.mapping_packages.states.view(id, sid),
            query: {tab: value}
        })


    const handleExport = (setIsExporting) => exportPackage(sectionApi, id, setIsExporting, item)

    const disabledTabs = {
        xpath: !validationReportTree || !validationReport.xpath?.length,
        sparql: !validationReportTree || !validationReport.sparql?.length,
        shacl: !validationReportTree || !validationReport.shacl?.length,
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
                        value={tab ?? 'details'}
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
                {(!tab || tab === 'details') && (
                    <StateDetails sid={sid}
                                  handleChangeTab={(value, id) => handleTabsChange(id, value)}
                                  item={item}
                                  validationReport={validationReport}/>
                )}
                {tab === 'xpath' && (
                    <XpathValidationReportView
                        sid={sid}
                        handleExport={handleExport}
                        validationReport={validationReport.xpath}
                        reportTree={validationReportTree}
                    />
                )}
                {tab === 'sparql' && (
                    <SparqlValidationReport
                        sid={sid}
                        handleExport={handleExport}
                        validationReport={validationReport.sparql}
                        reportTree={validationReportTree}
                    />
                )}
                {tab === 'shacl' && (
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
