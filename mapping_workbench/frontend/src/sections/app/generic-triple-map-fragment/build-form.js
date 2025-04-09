import {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import {fieldsRegistryApi as treeViewApi} from '../../../api/fields-registry';
import {genericTripleMapFragmentsApi as sectionApi} from '../../../api/triple-map-fragments/generic';
import CodeMirrorDefault from '../../../components/app/form/codeMirrorDefault';
import {useDialog} from '../../../hooks/use-dialog';
import {usePageView} from '../../../hooks/use-page-view';
import PredicateForm from '../triple-map-fragments/predicate-form';
import SourceForm from '../triple-map-fragments/source-form';
import SubjectForm from '../triple-map-fragments/subject-form';
import TreeView from '../triple-map-fragments/tree-view-form';
import TripleMapForm from '../triple-map-fragments/triple-map-form';
import {FileUploader} from './file-uploader';
import {getSource, getSubject, getTripleMap} from './rdflib-converter';

const BuildForm = ({rdfContent}) => {
    const uploadDialog = useDialog();

    const formik = useFormik({
        initialValues: {
            tripleMaps: [],
            selectedTripleMap: "",
            sources: []
        },
    })


    useEffect(() => {
        getTripleMap(rdfContent)
            .then(res => {
                formik.setFieldValue('tripleMaps', res)
                formik.setFieldValue('selectedTripleMap', res[0])
            })
    }, []);

    useEffect(() => {
        if (formik.values.selectedTripleMap) {
            getSource(rdfContent, formik.values.selectedTripleMap)
                .then(res => formik.setFieldValue('sources', res))
            getSubject(rdfContent, formik.values.selectedTripleMap)
                .then(res => console.log('res',res))
                .catch(err => console.error(err))
        }
    }, [formik.values.selectedTripleMap])


    const [addAnchor, setAddAnchor] = useState(null)
    const [wcmStatus, setWcmStatus] = useState(true)

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
                                    <TripleMapForm formik={formik}
                                                   rdfContent={rdfContent}></TripleMapForm>
                                    {formik.values.sources.map(source =>
                                        <SourceForm key={source.iterator}
                                                    {...source}/>)}
                                    <SubjectForm formik={formik}/>
                                    <PredicateForm formik={formik}/>
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
                            {selectedFormTab === 'code' && <CodeMirrorDefault value={rdfContent}
                                                                              style={{
                                                                                  resize: 'vertical',
                                                                                  overflow: 'auto',
                                                                                  height: 600
                                                                              }}
                                                                              lang={'TTL'}/>}
                        </Card>
                    </Grid>
                    <Grid item
                          md={6}
                          sm={12}>
                        <Card>
                            <Typography sx={{m: 3}}>Conceptual Mapping Browser</Typography>
                            <FormGroup>
                                <FormControlLabel sx={{flexDirection: 'row-reverse', justifyContent: 'end'}}
                                                  control={<Switch checked={wcmStatus}
                                                                   onChange={e => setWcmStatus(e.target.checked)}/>}
                                                  label="Elements with Conceptual Mappings"/>
                            </FormGroup>
                            <TreeView sectionApi={treeViewApi}
                                      wcm={wcmStatus}/>
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