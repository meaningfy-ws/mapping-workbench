import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CodeMirror from '@uiw/react-codemirror';
// import { basicSetup } from '@codemirror/basic-setup';
// import { turtle } from '@codemirror/lang-tt';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {FormTextField} from "../../../components/app/form/text-field";
import {sessionApi} from "../../../api/session";
import {FormCodeTextArea} from "../../../components/app/form/code-text-area";
import {FormCodeReadOnlyArea} from "../../../components/app/form/code-read-only-area";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import turtleValidator from "src/utils/turtle-validator";

export const EditForm = (props) => {
    const {itemctx, tree, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const [currentTab, setCurrentTab] = useState('tabEdit')

    const [selectedTree, setSelectedTree] = useState(tree?.[0]?.test_datas?.[0]?.test_data_id)
    const [testDataContent, setTestDataContent] = useState("")
    const [rdfResultContent, setRdfResultContent] = useState("")

    const [validation, setValidation] = useState({})

    const initialValues = {
        triple_map_uri: item.triple_map_uri ?? '',
        triple_map_content: item.triple_map_content ?? '',
        format: item.format ?? sectionApi.FILE_RESOURCE_DEFAULT_FORMAT ?? '',
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
                s
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
                sectionApi.getTripleMapRdfResultContent(item._id, selectedTree)
                    .then(res => {
                        setRdfResultContent(res.rdf_manifestation)
                        toastSuccess('Transformed Successfully', toastId)
                    })
                    .catch(err => catchError(err))
            })
            .catch(err => catchError(err))
            .finally(() => formik.setSubmitting(false))

    }

    const handleUpdateAndSubmit = () => {
        onUpdateAndTransform(formik.values)
    }

    const handleTurtleValidate =() => {
        turtleValidator(formik.values.triple_map_content)
            .then(res => setValidation(res))
            .catch(err=> console.log(err))
        // console.log('validation',validation)
        //                        setValidation(validation)
    }

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
                                <CodeMirror
      value={formik.values.triple_map_content}
      // extensions={[basicSetup, turtle()]}
      onChange={(value) => formik.setFieldValue('triple_map_content',value)}
      options={{
        mode: 'text/turtle',
        theme: 'default',
        lineNumbers: true,
      }}
    />
                                {/*<FormCodeTextArea*/}
                                {/*    disabled={formik.isSubmitting}*/}
                                {/*    formik={formik}*/}
                                {/*    name="triple_map_content"*/}
                                {/*    grammar={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}*/}
                                {/*    language={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['language']}*/}
                                {/*/>*/}
                            </Grid>

                        </Grid>
                        {validation.success}
                        {validation.error}
                    </CardContent>
                </Card>
            }
            {currentTab === 'tabTest' &&
                <Card sx={{mt: 3}}>
                    <CardHeader title={'Test ' + sectionApi.SECTION_ITEM_TITLE}/>
                    <CardContent>
                        <Grid container
                              spacing={2}>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    label="Select Test Data"
                                    onChange={e => setSelectedTree(e.target.value)}
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
                            <Grid xs={12}>
                                <Accordion>
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
                            <Grid xs={12}>
                                <Accordion disabled={!rdfResultContent}>
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
                    <Button onClick={() => {
                        handleTurtleValidate()
                        // turtleValidator(formik.values.triple_map_content)
                            // .then(res => {
                            //     console.warn(res)
                            //     setValidation({success: res})
                            // })
                            // .catch(err => {
                            //     console.warn(err)
                            //     setValidation({err})
                            // })
                    }}>Validate</Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        disabled={formik.isSubmitting}
                        href={paths.app.generic_triple_map_fragments.index}
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
