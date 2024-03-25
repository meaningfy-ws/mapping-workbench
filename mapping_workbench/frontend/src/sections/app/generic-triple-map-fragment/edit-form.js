import {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';

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
import {FormCodeHtmlArea} from "../../../components/app/form/code-html-area";

export const EditForm = (props) => {
    const {itemctx, tree, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const [selectedTree, setSelectedTree] = useState(tree?.[0]?.test_datas?.[0]?.test_data_id)
    const [htmlContent, setHtmlContent] = useState("")
    const [htmlResultContent, setHtmlResultContent] = useState("")

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
                toast.success(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "created" : "updated"));
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
                toast.error('Something went wrong!');
                helpers.setStatus({success: false});
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        selectedTree && handleGetHtmlContent(selectedTree)
    }, [selectedTree]);


    const handleGetHtmlContent = (id) => {
        sectionApi.getTripleMapHtmlContent(id)
            .then(res => {
                setHtmlContent(res.content);
            })
    }


    const onUpdateAndTransform = (values, helpers) => {

        values['project'] = sessionApi.getSessionProject();
        values['id'] = item._id;
        formik.setSubmitting(true)
        const toastId = toast.loading("Updating Content")
        sectionApi.updateItem(values)
            .then((res) => {
                if (res) {
                    toast.loading("Transforming Content", {id: toastId})
                    sectionApi.getTripleMapHtmlResultContent(selectedTree)
                        .then(res => {
                            if(res) {
                                setHtmlResultContent(res.rdf_manifestation)
                                toast.success('Transformed Successfully', {id: toastId})
                            }
                            else throw 'Something went wrong!'
                        })
                        .finally(() => formik.setSubmitting(false))
                }
                else throw 'Something went wrong!'
            })
            .catch((err) => {
                toast.error(err.message,{id: toastId})
                 formik.setStatus({success: false});
                 formik.setErrors({submit: err.message});
                 formik.setSubmitting(false);
            })
    }

    const handleUpdateAndSubmit = () => {
        onUpdateAndTransform(formik.values)
    }

    return (
        <form onSubmit={formik.handleSubmit}
              {...other}>
            <Card>
                <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                <CardContent sx={{pt: 0}}>
                    <Grid container
                          spacing={3}>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="triple_map_uri"
                                           label="URI"
                                           required={true}/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
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
                        <Grid xs={12}
                              md={12}>
                            <FormCodeTextArea
                                disabled={formik.isSubmitting}
                                formik={formik}
                                name="triple_map_content"
                                label="Content"
                                grammar={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                language={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
                            />
                        </Grid>
                        {!itemctx.isNew && <>
                            <Grid xs={12}
                                  md={12}>
                                <TextField
                                    fullWidth
                                    label="Tree"
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
                            <Grid xs={12}
                                  md={12}>
                                <Accordion>
                                    <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                                        Html Content
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormCodeHtmlArea
                                            disabled
                                            name="triple_map_content"
                                            label="HTML Content"
                                            defaultContent={htmlContent}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <Accordion disabled={!htmlResultContent}>
                                    <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                                        RDF Result
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormCodeHtmlArea
                                            disabled
                                            name="triple_map_content"
                                            label="HTML Result"
                                            defaultContent={htmlResultContent}
                                            grammar={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                            language={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            </>}
                    </Grid>
                </CardContent>
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
                        type="submit"
                        variant="contained"
                    >
                        {itemctx.isNew ? 'Create' : 'Update'}
                    </Button>
                    {!itemctx.isNew && <Button
                        disabled={formik.isSubmitting}
                        variant="outlined"
                        onClick={handleUpdateAndSubmit}
                    >
                        Update and Transform
                    </Button>}
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
    );
};

EditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
