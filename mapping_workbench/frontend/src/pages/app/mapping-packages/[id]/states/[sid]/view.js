import {useEffect, useState} from 'react';
import dynamic from "next/dynamic";

import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {Upload04 as ExportIcon} from "@untitled-ui/icons-react/build/esm";
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {mappingPackagesApi as previousSectionApi} from 'src/api/mapping-packages';
import {useRouter} from "src/hooks/use-router";
import {RouterLink} from 'src/components/router-link';
import exportPackage from "../../../../../../utils/export-mapping-package";

const StateDetails =
    dynamic(() => import("../../../../../../sections/app/mapping-package/state/state-details"));
const ShaclValidationReport =
    dynamic(() => import("../../../../../../sections/app/shacl_validation_report/shacl_validation_report_view"));
const SparqlValidationReport =
    dynamic(() => import("../../../../../../sections/app/sparql_validation_report/sparql_validation_report_view"));
const XpathValidationReportView =
    dynamic(() => import("../../../../../../sections/app/xpath_validation_report/xpath_validation_report_view"));

const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'XPath Reports', value: 'xpath'},
    {label: 'SPARQL Reports', value: 'sparql'},
    {label: 'SHACL Reports', value: 'shacl'},
];

const Page = () => {
    const router = useRouter();

    const {id,sid} = router.query;

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

    const handleItemsGet = async (sid) => {
        try {
            const response = await sectionApi.getState(sid);
            setItem(response);
        } catch (err) {
            console.error(err);
        }
    }

    const handleValidationReportTreeGet = async (sid) => {
        try {
            const result = await sectionApi.getValidationReportTree(sid)
            setValidationReportTree(result);
        } catch (err) {
            console.error(err);
        }
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
                                <ArrowLeftIcon/>
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
                    <StateDetails item={item}/>
                )}
                {currentTab === 'shacl' && (
                    <Card>
                        <CardContent>
                            <ShaclValidationReport sid={sid}
                                                   reportTree={validationReportTree}/>
                        </CardContent>
                    </Card>
                )}
                {currentTab === 'sparql' && (
                    <Card>
                        <CardContent>
                            <SparqlValidationReport sid={sid}
                                                    reportTree={validationReportTree}/>
                        </CardContent>
                    </Card>
                )}
                {currentTab === 'xpath' && (
                    <Card>
                        <CardContent>
                            <XpathValidationReportView sid={sid}
                                                       reportTree={validationReportTree}/>
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
