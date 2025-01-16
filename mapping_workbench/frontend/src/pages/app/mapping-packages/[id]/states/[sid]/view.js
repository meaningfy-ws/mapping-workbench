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
import SvgIcon from '@mui/material/SvgIcon';
import {useTheme} from '@mui/material/styles';
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
    {label: 'Coverage (XPath)', value: 'xpath'},
    {label: 'Correctness (SPARQL)', value: 'sparql'},
    {label: 'Compliance (SHACL)', value: 'shacl'},
];

const Page = () => {
    const router = useRouter();
    const theme = useTheme()
    console.log(theme)

    const {id, sid} = router.query;

    const [item, setItem] = useState({})
    const [currentTab, setCurrentTab] = useState('details');
    const [isExporting, setIsExporting] = useState()
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
            .then(res => setValidationReport(prev => ({...prev, sparql: mapSparqlResults(res.summary)})))
            .catch(err => console.error(err))
    }

    const mapSparqlResults = (result) => result.map(e => {
        const queryAsArray = e.query.content.split("\n")
        const values = queryAsArray.slice(0, 3)
        const resultArray = {}
        values.forEach(e => {
                const res = e.split(": ")
                resultArray[res[0].substring(1)] = res[1]
            }
        )
        resultArray["query"] = queryAsArray.slice(4, queryAsArray.length).join("\n")
        resultArray["test_suite"] = e.query.filename
        resultArray["result"] = e.result
        Object.entries(e.result).forEach(entrie => {
            const [key, value] = entrie
            resultArray[`${key}Count`] = value.count
        })
        resultArray["meets_xpath_condition"] = e.meets_xpath_condition
        resultArray["xpath_condition"] = e.query?.cm_rule?.xpath_condition
        return resultArray;
    })


    const resultSummaryXPATHGet = (sid) => {
        sectionApi.getXpathReports(sid)
            .then(res => {
                setValidationReport(prev => ({
                    ...prev,
                    xpath: res.results.map(e => ({...e, notice_count: e.test_data_xpaths.length}))
                }))
            })
            .catch(err => {
                console.error(err);
            })
    }


    const resultSummarySHACLGet = (sid) => {
        sectionApi.getShaclReports(sid)
            .then(res => setValidationReport(prev => ({...prev, shacl: mapShaclResults(res.summary)})))
            .catch(err => {
                console.error(err);
            })
    }

    const mapShaclResults = (result) => {
        return result.results.map(e => {
            const resultArray = {}
            resultArray["shacl_suite"] = result.shacl_suites?.[0]?.shacl_suite_id
            resultArray["short_result_path"] = e.short_result_path
            resultArray["result"] = e.result
            Object.entries(e.result).forEach(entrie => {
                const [key, value] = entrie
                resultArray[`${key}Count`] = value.count
            })
            return resultArray;
        })
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

    const handleExport = (item) => exportPackage(sectionApi, id, setIsExporting, item)

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
                                  handleChangeTab={setCurrentTab}
                                  item={item}
                                  validationReport={validationReport}/>
                )}
                {currentTab === 'xpath' && (
                    <XpathValidationReportView
                        sid={sid}
                        validationReport={validationReport.xpath}
                        reportTree={validationReportTree}
                    />
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
