import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {useFormik} from 'formik';
import {useState} from 'react';
import * as Yup from 'yup';
import {fieldsRegistryApi as treeViewApi} from '../../../api/fields-registry';
import {genericTripleMapFragmentsApi as sectionApi} from '../../../api/triple-map-fragments/generic';
import CodeMirrorDefault from '../../../components/app/form/codeMirrorDefault';
import {useDialog} from '../../../hooks/use-dialog';
import {usePageView} from '../../../hooks/use-page-view';
import TreeView from '../tree-view/tree-view';
import Predicate from '../triple-map-fragments/predicate';
import Source from '../triple-map-fragments/source';
import Subject from '../triple-map-fragments/subject';
import TripleMap from '../triple-map-fragments/triple-map';
import {FileUploader} from './file-uploader';

const BuildForm = () => {
    const uploadDialog = useDialog();

    const [addAnchor, setAddAnchor] = useState(null)

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
    const [selectedFormTab, setSelectedFormTab] = useState('form')
    // const technicalMappingsTabs = [{label: 'TM1', value: 'tm1'}]


    const formik = useFormik({
        initialValues: {
            github_repository_url: "",
            branch_or_tag_name: ""
        },
    })

    const handleAdd = () => {}

    return (
        <>
            <Card sx={{mt: 3}}>
                <Grid container>
                    <Grid item
                          md={6}
                          sm={12}>
                        <Card>
                            <Tabs onChange={(e, v) => setSelectedFormTab(v)}
                                  value={selectedFormTab}
                                  sx={{mx: 2, my: 1}}>
                                {formTabs.map(formTab =>
                                    <Tab key={formTab.value}
                                         {...formTab}/>)}

                            </Tabs>
                            {/*<Tabs value={selectedTMTab}>*/}
                            {/*    {technicalMappingsTabs.map((technicalMappingsTab, index) =>*/}
                            {/*        <Tab key={technicalMappingsTab.value}*/}
                            {/*             label={technicalMappingsTab.label}*/}
                            {/*             onClick={() => setSelectedTMTab(technicalMappingsTab.value)}*/}
                            {/*             value={technicalMappingsTab.value}/>*/}
                            {/*    )}*/}
                            {/*    <Tab label={<AddIcon/>}*/}
                            {/*         onClick={() => {*/}
                            {/*             setSelectedTMTab(`tm${technicalMappingsTabs.length + 1}`)*/}
                            {/*             setTechnicalMappingsTabs(e => [...e,*/}
                            {/*                 {*/}
                            {/*                     label: `TM${technicalMappingsTabs.length + 1}`,*/}
                            {/*                     value: `tm${technicalMappingsTabs.length + 1}`*/}
                            {/*                 }*/}
                            {/*             ])*/}
                            {/*         }}/>*/}
                            {/*</Tabs>*/}
                            {selectedFormTab === 'form' && <Stack sx={{p: 1}}>
                                <Card sx={{p: 1, border: "1px solid #E4E7EC"}}>
                                    <TripleMap formik={formik}></TripleMap>
                                    <Source formik={formik}></Source>
                                    <Subject formik={formik}/>
                                    <Predicate formik={formik}/>
                                    <Stack alignItems='end'>
                                        <Button onClick={(e) => setAddAnchor(e.target)}
                                                startIcon={<AddIcon/>}
                                                endIcon={<KeyboardArrowDownIcon/>}>
                                            Add
                                        </Button>
                                        <Popover
                                            id='addButton'
                                            open={!!addAnchor}
                                            anchorEl={addAnchor}
                                            onClose={() => setAddAnchor(null)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <MenuItem onClick={handleAdd}>
                                                Subject
                                            </MenuItem>
                                            <MenuItem onClick={handleAdd}>
                                                Predicate
                                            </MenuItem>
                                            <MenuItem onClick={handleAdd}>
                                                Source
                                            </MenuItem>
                                        </Popover>
                                    </Stack>
                                </Card>
                            </Stack>}
                            {selectedFormTab === 'code' && <CodeMirrorDefault/>}
                        </Card>
                    </Grid>
                    <Grid item
                          md={6}
                          sm={12}>
                        <Card>
                            <Typography sx={{m: 3}}>Conceptual Mapping Browser</Typography>
                            <FormGroup>
                                <FormControlLabel sx={{flexDirection: 'row-reverse', justifyContent: 'end'}}
                                                  control={<Switch defaultChecked/>}
                                                  label="Elements with Conceptual Mappings"/>
                            </FormGroup>
                            <TreeView sectionApi={treeViewApi}/>
                        </Card>
                    </Grid>
                </Grid>
            </Card>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                sectionApi={sectionApi}
                formik={uploadFormik}
            />
        </>
    );
};

export default BuildForm