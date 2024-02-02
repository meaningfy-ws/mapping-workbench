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

import exportPackage from "../../../../../../utils/export-mapping-package";
import {sessionApi} from "../../../../../../api/session";
import {ListTable} from "../../../../../../sections/app/shacl_validation_report/list-table";
import {useMounted} from "../../../../../../hooks/use-mounted";
import {FileCollectionListSearch} from "../../../../../../sections/app/file-manager/file-collection-list-search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


const tabs = [
    {label: 'Details', value: 'details'},
    {label: 'Shacl Reports', value: 'shacl'},

];

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters,
            page: 0
        }));
    }, []);

    const handlePageChange = useCallback((event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, []);

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};


const useItemsStore = (project_id, id, sid, searchState) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const response = await sectionApi.getValidationReports({
                project_id,
                id,
                sid,
                searchState
            });
            console.log(sectionApi.getValidationReports)
            if (isMounted()) {
                setState({
                    items: response.shacl,
                    itemsCount: response.shacl.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);


    useEffect(() => {
            handleItemsGet().then(response => {
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

const Page = () => {
    const router = useRouter();

    if (!router.isReady) return;
    const {id,sid} = router.query;

    if (!id || !sid) {
        return;
    }
    const [currentTab, setCurrentTab] = useState('details');
    const [item, setItem] = useState()
    const [isExporting, setIsExporting] = useState()
    const [validationReports, setValidationReports] = useState()
    const [selectShaclValidationFile,setSelectShaclValidationFile] = useState()

    // const itemsSearch = useItemsSearch();
    // const itemsStore = useItemsStore(sessionApi.getSessionProject(), id, sid, itemsSearch.state);


    useEffect(() => {
        handleItemsGet(sid);
        handleValidationResultsGet(sessionApi.getSessionProject(), id, sid)
    }, []);
    const handleItemsGet = async (sid) => {
        try {
            const response = await sectionApi.getState(sid);
            setItem(response);
        } catch (err) {
            console.error(err);
        }
    }


    const handleValidationResultsGet = async (project_id,package_id,state_id) => {
        const data = { project_id, package_id, state_id }
        try {
            const result = await sectionApi.getValidationReports(data)
            setValidationReports(result);
            setSelectShaclValidationFile(result?.shacl[0].identifier)
        } catch (err) {
            console.error(err);
        }
    }

    usePageView();


    const handleTabsChange = (event, value) => {
        console.log(value)
        setCurrentTab(value)
    }
    const handleExport = (item) => {
        return exportPackage(sectionApi, id, setIsExporting, item)
    }

    const shaclValidationFile = validationReports?.shacl.find(e => e.identifier === selectShaclValidationFile) ?? []

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
                {currentTab === 'shacl' && (
                    <>
                        <Select
                            onChange={(e) => setSelectShaclValidationFile(e.target.value)}
                            // defaultValue={validationReports?.shacl[0].identifier}
                            value={selectShaclValidationFile}>

                            {validationReports?.shacl.map(e=>
                                <MenuItem key={e.identifier}
                                          value={e.identifier}>
                                    {e.identifier}
                                </MenuItem>)}
                        </Select>
                        <Card>
                            <CardContent>
                                {/*<FileCollectionListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>*/}
                                <ListTable
                                    // onPageChange={itemsSearch.handlePageChange}
                                    // onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                                    // page={itemsSearch.state.page}
                                    items={shaclValidationFile}
                                    count={shaclValidationFile.count}
                                    // rowsPerPage={itemsSearch.state.rowsPerPage}
                                    sectionApi={sectionApi}
                                />
                            </CardContent>
                        </Card>
                    </>
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
