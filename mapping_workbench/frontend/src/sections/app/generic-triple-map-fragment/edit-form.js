import {useCallback, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {Box} from "@mui/system";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from '@mui/material/Card';
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from "@mui/material/FormControlLabel";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";


import {paths} from 'src/paths';
import {sessionApi} from "src/api/session";
import {useRouter} from 'src/hooks/use-router';
import {RouterLink} from 'src/components/router-link';
import turtleValidator from "src/utils/turtle-validator";
import {FormTextField} from "src/components/app/form/text-field";
import CodeMirrorDefault from "src/components/app/form/codeMirrorDefault";
import {FormCodeReadOnlyArea} from "src/components/app/form/code-read-only-area";
import {toastError, toastLoad, toastSuccess, toastWarning} from "src/components/app-toast";
import {MappingPackageFormSelect} from "../mapping-package/components/mapping-package-form-select";
import {MappingPackageCheckboxList} from '../mapping-package/components/mapping-package-real-checkbox-list';


export const EditForm = (props) => {
    const {itemctx, tree, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const [currentTab, setCurrentTab] = useState('tabEdit')

    const [selectedTree, setSelectedTree] = useState(tree?.[0]?.test_datas?.[0]?.test_data_id)
    const [testDataContent, setTestDataContent] = useState("")
    const [rdfResultContent, setRdfResultContent] = useState("")
    const [hasRdfResult, setHasRdfResult] = useState(false)
    const [useThisTripleMap, setUseThisTripleMap] = useState(false)
    const [mappingPackageId, setMappingPackageId] = useState(null)

    const [validation, setValidation] = useState({})

    const initialValues = {
        triple_map_uri: item.triple_map_uri ?? '',
        triple_map_content: item.triple_map_content ?? '',
        refers_to_mapping_package_ids: item.refers_to_mapping_package_ids ?? [],
        format: item.format ?? sectionApi.FILE_RESOURCE_DEFAULT_FORMAT ?? ''
        };


    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            triple_map_uri: Yup
                .string()
                .max(255)
                .required('URI is required'),
            triple_map_content: Yup.string(),
            format: Yup
                .string()
                .max(255)
                .required('Format is required')
        }),
        onSubmit: async (values, helpers) => {
            const toastId = toastLoad("Updating...")
            try {
                let response;
                values['project'] = sessionApi.getSessionProject();
                if (itemctx.isNew) {
                    response = await sectionApi.createItem(values);
                } else {
                    values['id'] = item._id;
                    response = await sectionApi.updateItem(values);
                }
                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "created" : "updated"), toastId);
                if (response) {
                    if (itemctx.isNew) {
                        router.push({
                            pathname: paths.app[sectionApi.section].index,
                            query: {id: response._id}
                        });
                    } else if (itemctx.isStateable) {
                        itemctx.setState(response);
                    }
                }
            } catch (err) {
                console.error(err);
                toastError(err, toastId);
                helpers.setStatus({success: false});
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        selectedTree && handleGetXmlContent(selectedTree)
    }, [selectedTree]);


    const handleGetXmlContent = (id) => {
        sectionApi.getTripleMapXmlContent(id)
            .then(res => {
                setTestDataContent(res.content);
            })
    }

    const onUpdateAndTransform = (values, helpers) => {
        delete values['mapping_package_id'];
        values['project'] = sessionApi.getSessionProject();
        values['id'] = item._id;
        formik.setSubmitting(true)
        const toastId = toastLoad("Updating Content")
        const catchError = (err) => {
            toastError(err, toastId)
            formik.setStatus({success: false});
            formik.setErrors({submit: err.message});
            formik.setSubmitting(false);
        }

        if (!selectedTree) {
            catchError(Error("Select Test Data"));
            return false;
        }

        sectionApi.updateItem(values)
            .then(res => {
                toastLoad("Transforming Content", toastId);
                sectionApi.getTripleMapRdfResultContent(item._id, selectedTree, useThisTripleMap, mappingPackageId)
                    .then(res => {
                        setRdfResultContent(res.rdf_manifestation)
                        setHasRdfResult(true);
                        if (res.rdf_manifestation) {
                            toastSuccess('Transformed Successfully', toastId)
                        } else {
                            toastWarning('Empty Result!', toastId)
                        }
                    })
                    .catch(err => {
                        setRdfResultContent(null)
                        setHasRdfResult(false);
                        return catchError(err)
                    })
                    .finally(() => formik.setSubmitting(false))
            })
            .catch(err => {
                catchError(err)
                formik.setSubmitting(false)
            })

    }

    const handleUpdateAndSubmit = () => {
        onUpdateAndTransform(formik.values)
    }

    const handleTurtleValidate = () => {
        turtleValidator(formik.values.triple_map_content)
            .then(res => setValidation(res))
            .catch(err => setValidation({error: err}))
    }

    const handleTransformUsingThisTripleMap = useCallback(event => {
        setUseThisTripleMap(event.target.checked);
    }, []);

    return (
        <form onSubmit={formik.handleSubmit}
              {...other}>
            {!itemctx.isNew && <Tabs value={currentTab}
                                     onChange={(e, v) => setCurrentTab(v)}>
                <Tab label='Edit Triple Map Fragment'
                     value='tabEdit'></Tab>
                <Tab label='Test Triple Map Fragment'
                     value='tabTest'></Tab>
            </Tabs>}


            {currentTab === 'tabEdit' &&
                <Card sx={{mt: 3}}>
                    <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={6}>
                                <FormTextField formik={formik}
                                               name="triple_map_uri"
                                               label="URI"
                                               required
                                />
                            </Grid>
                            <Grid xs={12}
                                  md={6}>
                                <TextField
                                    error={!!(formik.touched.format && formik.errors.format)}
                                    fullWidth
                                    helperText={formik.touched.format && formik.errors.format}
                                    onBlur={formik.handleBlur}
                                    label="Format"
                                    onChange={e => {
                                        formik.setFieldValue("format", e.target.value);
                                    }}
                                    select
                                    required
                                    value={formik.values.format}
                                >
                                    {Object.keys(sectionApi.FILE_RESOURCE_FORMATS).map((key) => (
                                        <MenuItem key={key}
                                                  value={key}>
                                            {sectionApi.FILE_RESOURCE_FORMATS[key]}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid xs={12}>
                                <Card sx={{m: 0, p: 0}}>
                                    <CardHeader sx={{mt: 0, pt: 0, pb: 0}}
                                                title="Mapping Packages"/>
                                    <Box sx={{ml: 2, mt: 2}}>
                                        <MappingPackageCheckboxList handleUpdate={values => formik.setFieldValue('refers_to_mapping_package_ids',values)}
                                                                    mappingPackages={formik.values.refers_to_mapping_package_ids}
                                                                    withDefaultPackage={itemctx.isNew}
                                        />
                                    </Box>
                                </Card>
                                <Divider/>
                            </Grid>
                            <Grid xs={12}>
                                <CodeMirrorDefault
                                    style={{resize: 'vertical', overflow: 'auto', height: 600}}
                                    value={formik.values.triple_map_content}
                                    lang={formik.values.format}
                                    onChange={(value) => formik.setFieldValue('triple_map_content', value)}
                                />
                            </Grid>

                        </Grid>
                        <Box sx={{color: 'green'}}>{validation.success}</Box>
                        <Box sx={{color: 'red'}}>{validation.error}</Box>
                    </CardContent>
                </Card>
            }
            {currentTab === 'tabTest' &&
                <Card sx={{mt: 3}}>
                    <CardHeader title={'Test ' + sectionApi.SECTION_ITEM_TITLE}/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={2}>
                            <Grid xs={12}>
                                <FormControlLabel
                                    sx={{width: '100%'}}
                                    control={
                                        <Checkbox
                                            checked={useThisTripleMap}
                                            onChange={handleTransformUsingThisTripleMap}
                                        />
                                    }
                                    label="Use only this Triple Map Fragment"
                                    value=""
                                />
                            </Grid>
                            <Grid xs={12}
                                  lg={6}>
                                <TextField
                                    fullWidth
                                    label="Select Test Data"
                                    onChange={e => {
                                        setSelectedTree(e.target.value)
                                    }}
                                    select
                                    value={selectedTree}
                                >
                                    {tree.map(suite =>
                                        [<MenuItem key={suite.suite_id}
                                                   value={suite.suite_id}
                                                   disabled>{suite.suite_title}

                                        </MenuItem>,
                                            suite.test_datas.map(testData =>
                                                <MenuItem key={testData.test_data_id}
                                                          value={testData.test_data_id}
                                                          style={{paddingLeft: 40}}>
                                                    {testData.test_data_title}
                                                </MenuItem>)])
                                    }
                                </TextField>
                            </Grid>
                            <Grid xs={12}
                                  lg={6}>
                                <MappingPackageFormSelect
                                    formik={formik}
                                    isRequired={false}
                                    withDefaultPackage={itemctx.isNew}
                                    setMappingPackageId={setMappingPackageId}
                                />
                            </Grid>
                            <Grid xs={12}
                                  lg={6}>
                                <Accordion sx={{width: '100%'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        Test Data Content
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormCodeReadOnlyArea
                                            disabled
                                            name="test_data_content"
                                            label="Test Data Content"
                                            defaultContent={testDataContent}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid xs={12}
                                  lg={6}>
                                <Stack>
                                    <Accordion disabled={!rdfResultContent}
                                               expanded={!!rdfResultContent}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                            RDF Result
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <FormCodeReadOnlyArea
                                                disabled
                                                name="triple_map_content"
                                                label="RDF Result"
                                                defaultContent={rdfResultContent}
                                                grammar={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                                language={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                    {hasRdfResult && !rdfResultContent &&
                                        <Alert severity="warning"
                                               sx={{mt: 2}}>
                                            Our service could not generate the RDF by using the provided resources.
                                        </Alert>}
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>}


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
                        type="submit"
                        variant="contained"
                    >
                        {itemctx.isNew ? 'Create' : 'Update'}
                    </Button>
                    {!itemctx.isNew && <Button
                        disabled={formik.isSubmitting}
                        variant="outlined"
                        onClick={handleUpdateAndSubmit}
                        id="update_and_transform_button"
                    >
                        Update and Transform
                    </Button>}
                    {formik.values.format === 'TTL' && currentTab === 'tabEdit' &&
                        <Button onClick={handleTurtleValidate}>Validate</Button>}
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
        </form>
    )
        ;
};

EditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
