import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {useFormik} from "formik";
import {useState} from 'react';
import * as Yup from "yup";

import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useDialog} from "src/hooks/use-dialog";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {TechnicalMappingsTabs} from 'src/sections/app/technical-mappings';
import {ListTable} from "src/sections/app/generic-triple-map-fragment/list-table";
import {FileUploader} from "src/sections/app/generic-triple-map-fragment/file-uploader";
import {genericTripleMapFragmentsApi as sectionApi} from 'src/api/triple-map-fragments/generic';
import CodeMirrorDefault from '../../../components/app/form/codeMirrorDefault';
import {NavigationTabsWrapper} from '../../../components/navigation-tabs-wrapper';
import Predicate from '../../../sections/app/triple-map-fragments/predicate';
import Source from '../../../sections/app/triple-map-fragments/source';
import Subject from '../../../sections/app/triple-map-fragments/subject';
import TripleMap from '../../../sections/app/triple-map-fragments/triple-map';

const Page = () => {
    const [technicalMappingsTabs, setTechnicalMappingsTabs] = useState([{label: 'TM1', value: 'tm1'}])
    const [selectedTMTab, setSelectedTMTab] = useState('tm1')

    const uploadDialog = useDialog();
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['triple_map_uri']);

    usePageView();

    const uploadFormik = useFormik({
        initialValues: {
            mapping_package_id: ''
        },
        validationSchema: Yup.object({
            mapping_package_id: Yup
                .string()
                .required('Mapping Package is required'),
        })
    });

    const formTabs = [{label: 'Form', value: 'form'}, {label: 'Code', value: 'code'}]
    // const technicalMappingsTabs = [{label: 'TM1', value: 'tm1'}]

    console.log(technicalMappingsTabs)

    const formik = useFormik({
        initialValues: {
            github_repository_url: "",
            branch_or_tag_name: ""
        },
    })

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <NavigationTabsWrapper>
                <TechnicalMappingsTabs/>
            </NavigationTabsWrapper>
            <Stack spacing={4}
                   mt={5}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Paper>
                        <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                        value={itemsSearch.state.search[0]}/>
                    </Paper>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            onClick={uploadDialog.handleOpen}
                            startIcon={<UploadIcon/>}
                            id="upload_fragment_button"
                        >
                            Upload
                        </Button>
                        <Button
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={<AddIcon/>}
                            id="add_button"
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <Grid container>
                        <Grid item
                              md={6}
                              sm={12}>
                            <Card>
                                <Tabs>
                                    {formTabs.map(formTab =>
                                        <Tab key={formTab.value}
                                             {...formTab}/>)}

                                </Tabs>
                                <Tabs value={selectedTMTab}>
                                    {technicalMappingsTabs.map((technicalMappingsTab, index) =>
                                        <Tab key={technicalMappingsTab.value}
                                             label={technicalMappingsTab.label}
                                             onClick={() => setSelectedTMTab(technicalMappingsTab.value)}
                                             value={technicalMappingsTab.value}/>
                                    )}
                                    <Tab label={<AddIcon/>}
                                         onClick={() => {
                                             setSelectedTMTab(`tm${technicalMappingsTabs.length + 1}`)
                                             setTechnicalMappingsTabs(e => [...e,
                                                 {
                                                     label: `TM${technicalMappingsTabs.length + 1}`,
                                                     value: `tm${technicalMappingsTabs.length + 1}`
                                                 }
                                             ])
                                         }}/>
                                </Tabs>
                                <Stack sx={{p:1}}>
                                    <TripleMap formik={formik}></TripleMap>
                                    <Source formik={formik}></Source>
                                    <Subject formik={formik}/>
                                    <Predicate formik={formik}/>
                                </Stack>
                                <CodeMirrorDefault/>
                            </Card>
                        </Grid>
                        <Grid item
                              md={6}
                              sm={12}>
                            <Card>
                                <Typography>Conceptual Mapping Browser</Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Card>
            </Stack>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                sectionApi={sectionApi}
                formik={uploadFormik}
            />
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
