import {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';

import Box from '@mui/system/Box';
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


import {paths} from '../../../paths';
import buildFile from './build-file';
import {FileUploader} from './file-uploader';
import {sessionApi} from '../../../api/session';
import {useDialog} from '../../../hooks/use-dialog';
import {usePageView} from '../../../hooks/use-page-view';
import {RouterLink} from '../../../components/router-link';
import turtleValidator from '../../../utils/turtle-validator';
import SourceForm from '../triple-map-fragments/source-form';
import SubjectForm from '../triple-map-fragments/subject-form';
import TreeView from '../triple-map-fragments/tree-view-form';
import PredicateForm from '../triple-map-fragments/predicate-form';
import TripleMapForm from '../triple-map-fragments/triple-map-form';
import ConfirmDialog from '../../../components/app/dialog/confirm-dialog';
import {fieldsRegistryApi as treeViewApi} from '../../../api/fields-registry';
import CodeMirrorDefault from '../../../components/app/form/codeMirrorDefault';
import {toastError, toastLoad, toastSuccess} from '../../../components/app-toast';
import {getPredicate, getSource, getSubject, getTripleMap} from './rdflib-converter';
import {genericTripleMapFragmentsApi as sectionApi} from '../../../api/triple-map-fragments/generic';


const BuildForm = ({rdfContent, id, format, refers_to_mapping_package_ids, triple_map_uri}) => {
    const [tripleMaps, setTripleMaps] = useState([])
    const [selectedTripleMap, setSelectedTripleMap] = useState({})
    const [processedTripleMaps, setProcessedTripleMaps] = useState({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [showCode, setShowCode] = useState(false)
    const [validation, setValidation] = useState({})
    const [addAnchor, setAddAnchor] = useState(null)
    const [wcmStatus, setWcmStatus] = useState(true)

    console.log(processedTripleMaps)

    const formik = useFormik({
            initialValues: {
                tripleFile: {}
            }
        }
    )

    const onUpdate = async (triple_map_content) => {
        const toastId = toastLoad("Updating...")
        const project = sessionApi.getSessionProject()
        sectionApi.updateItem({
            id,
            format,
            project,
            refers_to_mapping_package_ids,
            triple_map_uri,
            triple_map_content
        }).then(res => {
            formik.setStatus({success: true});
            formik.setSubmitting(false);
            toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + "updated", toastId);
        }).catch(err => {
                console.error(err);
                toastError(err, toastId);
                formik.setStatus({success: false});
                formik.setErrors({submit: err.message});
                formik.setSubmitting(false);
            }
        )
    }

    const uploadDialog = useDialog();

    useEffect(() => {
        getTripleMap(rdfContent)
            .then(res => {
                console.log('res', res)
                !!res.length && getTripleMapData(res)

                setTripleMaps(res)
                setSelectedTripleMap(res[0])
            })
    }, []);

    useEffect(() => {
        selectedTripleMap && processedTripleMaps && formik.setFieldValue('tripleFile', processedTripleMaps[selectedTripleMap])
    }, [selectedTripleMap, processedTripleMaps])

    const getTripleMapData = async (triples) => {
        if (!!triples.length)
            for (const tripleMap of triples) {
                const sources = await getSource(rdfContent, tripleMap)
                const subjects = await getSubject(rdfContent, tripleMap)
                const predicates = await getPredicate(rdfContent, tripleMap)

                setProcessedTripleMaps(e => ({...e, [tripleMap]: {subjects, sources, predicates}}))
                // formik.setFieldValue(tripleMap, {subjects, sources, predicates})
            }
    }


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

    console.log(formik.values.tripleFile)

    const formTabs = [{label: 'Form', value: 'form'}, {label: 'Code', value: 'code'}]
    const [selectedFormTab, setSelectedFormTab] = useState('form')
    const [buildedFile, setBuildedFile] = useState()

    const handleAdd = (type) => {
        const currentTypeObj = {...formik.values.tripleFile}
        currentTypeObj[type].push({})
        setAddAnchor(null)
    }

    const handleSave = () => {
        const buildedFile = buildFile(processedTripleMaps)
        setBuildedFile(buildedFile)
        turtleValidator(buildedFile)
            .then(res => {
                setValidation(res)
                onUpdate(buildedFile)
            })
            .catch(err => setValidation({error: err}))
    }

    const handleUpdate = (values, index, type) => {
        const currentTypeObj = {...formik.values.tripleFile}
        currentTypeObj[type][index] = values
        formik.setFieldValue('tripleFile', currentTypeObj)
    }

    const handleDelete = (index, type) => {
        setConfirmOpen({index, type})
    }

    const handleConfirm = () => {
        const {index, type} = confirmOpen
        const currentTypeObj = {...formik.values.tripleFile}
        currentTypeObj[type].splice(index, 1)
        // formik.setFieldValue('tripleFile', currentTypeObj)
    }

    const handleTurtleValidate = () => {
        const buildedFile = buildFile(processedTripleMaps)
        setBuildedFile(buildedFile)
        turtleValidator(buildedFile)
            .then(res => setValidation(res))
            .catch(err => setValidation({error: err}))
    }

    const handleAddTripleMap = (value) => {
        setTripleMaps(e => [...e, value])
        setProcessedTripleMaps(e => ({...e, [value]: {subjects: [], sources: [], predicates: []}}))
    }

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
                                    <TripleMapForm selectedTripleMap={selectedTripleMap}
                                                   setSelectedTripleMap={setSelectedTripleMap}
                                                   tripleMaps={tripleMaps}
                                                   addTripleMap={handleAddTripleMap}
                                                   rdfContent={rdfContent}>
                                    </TripleMapForm>
                                    {formik.values.tripleFile?.sources?.map((source, index) =>
                                        <SourceForm key={'source' + index}
                                                    handleUpdate={(values) => handleUpdate(values, index, 'sources')}
                                                    handleDelete={() => handleDelete(index, 'sources')}
                                                    tripleMap={selectedTripleMap}
                                                    id={index}
                                                    {...source}/>
                                    )}
                                    {formik.values.tripleFile?.subjects?.map((subject, index) =>
                                        <SubjectForm key={'subject' + index}
                                                     handleUpdate={(values) => handleUpdate(values, index, 'subjects')}
                                                     handleDelete={() => handleDelete(index, 'subjects')}
                                                     {...subject}/>)}
                                    {formik.values.tripleFile?.predicates?.map((predicate, index) =>
                                        <PredicateForm key={'predicate' + index}
                                                       handleUpdate={(values) => handleUpdate(values, index, 'predicates')}
                                                       handleDelete={() => handleDelete(index, 'predicates')}
                                                       {...predicate}/>)
                                    }
                                    <Stack alignItems='end'>
                                        {/*<Button onClick={handleSave}>Save</Button>*/}
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
                                            <MenuItem onClick={() => handleAdd('subjects')}>
                                                Subject
                                            </MenuItem>
                                            <MenuItem onClick={() => handleAdd('predicates')}>
                                                Predicate
                                            </MenuItem>
                                            <MenuItem onClick={() => handleAdd('sources')}>
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
                            <FormGroup>
                                <FormControlLabel sx={{flexDirection: 'row-reverse', justifyContent: 'end'}}
                                                  control={<Switch checked={showCode}
                                                                   onChange={e => setShowCode(e.target.checked)}/>}
                                                  label="Show File"/>
                            </FormGroup>
                            {showCode ?
                                <>
                                    <CodeMirrorDefault value={buildedFile}
                                                       style={{
                                                           resize: 'vertical',
                                                           overflow: 'auto',
                                                           height: 600
                                                       }}
                                                       lang={'TTL'}/>
                                    <Box sx={{color: 'green'}}>{validation.success}</Box>
                                    <Box sx={{color: 'red'}}>{validation.error}</Box>
                                </>
                                : <>
                                    <Typography sx={{m: 3}}>Conceptual Mapping Browser</Typography>
                                    <FormGroup>
                                        <FormControlLabel sx={{flexDirection: 'row-reverse', justifyContent: 'end'}}
                                                          control={<Switch checked={wcmStatus}
                                                                           onChange={e => setWcmStatus(e.target.checked)}/>}
                                                          label="Elements with Conceptual Mappings"/>
                                    </FormGroup>
                                    <TreeView sectionApi={treeViewApi}
                                              wcm={wcmStatus}/>
                                </>}
                        </Card>
                    </Grid>
                </Grid>
            </Card>
            <Card sx={{mt: 3}}>
                <Stack
                    direction={{
                        xs: 'column',
                        sm: 'row'
                    }}
                    flexWrap="wrap"
                    spacing={3}
                    sx={{p: 3}}
                >
                    <Button
                        disabled={formik.isSubmitting}
                        // type="submit"
                        onClick={handleSave}
                        variant="contained"
                    >
                        Update
                    </Button>
                    <Button onClick={handleTurtleValidate}>Validate</Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        disabled={formik.isSubmitting}
                        href={paths.app.specific_triple_map_fragments.index}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Card>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                sectionApi={sectionApi}
                formik={uploadFormik}
            />
            <ConfirmDialog
                title="Delete It?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={handleConfirm}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
        </>
    );
};

export default BuildForm