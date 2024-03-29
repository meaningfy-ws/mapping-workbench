import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Button from '@mui/material/Button';
import { MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {paths} from 'src/paths';
import {RouterLink} from 'src/components/router-link';
import {useRouter} from 'src/hooks/use-router';
import {FormTextField} from "../../../components/app/form/text-field";
import {FormTextArea} from "../../../components/app/form/text-area";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const sourceSchemaTypes = [
        {
            value: 'JSON'
        },
        {
            value: 'XSD'
        }
    ];

    const initialValues = {
        title: item.title ?? '',
        description: item.description ?? '',
        version: item.version ?? '',
        source_schema: {
            title: item.source_schema?.title ?? '',
            description: item.source_schema?.description ?? '',
            version: item.source_schema?.version ?? '',
            type: item.source_schema?.type ?? 'JSON'
        },
        target_ontology: {
            title: item.target_ontology?.title ?? '',
            description: item.target_ontology?.description ?? '',
            version: item.target_ontology?.version ?? '',
            uri: item.target_ontology?.uri ?? ''
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048),
            version: Yup.string().max(255)
            // source_schema: {
            //     title: Yup.string().max(255),
            //     description: Yup.string().max(2048),
            //     version: Yup.string().max(255),
            //     type: Yup.string().max(255)
            // }
        }),

        onSubmit: async (values, helpers) => {
            try {
                let response;
                if (itemctx.isNew) {
                    response = await sectionApi.createItem(values);
                } else {
                    values['id'] = item._id;
                    response = await sectionApi.updateItem(values);
                }
                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toast.success(`${sectionApi.SECTION_ITEM_TITLE} ${itemctx.isNew ? "created" : "updated"}`);
                if (response) {
                    if (itemctx.isNew) {
                        router.push({
                            pathname: paths.app[sectionApi.section].index,
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

    return (
        <form
            onSubmit={formik.handleSubmit}
            {...other}>
            <Card>
                <CardHeader title={`${itemctx.isNew ? 'Create' : 'Edit'} ${sectionApi.SECTION_ITEM_TITLE}`}/>
                <CardContent sx={{pt: 0}}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="title"
                                           label="Title"
                                           required/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextArea formik={formik}
                                          name="description"
                                          label="Description"/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="version"
                                           label="Version"/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Grid
                container
                sx={{pt: 3}}
                spacing={3}
            >
                <Grid
                    xs={12}
                    md={6}
                >
                    <Card>
                        <CardHeader title="Source Schema"/>
                        <CardContent sx={{pt: 0}}>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.source_schema && formik.touched.source_schema.title && formik.errors.source_schema && formik.errors.source_schema.title)}
                                    fullWidth
                                    //helperText={formik.touched.source_schema && formik.touched.source_schema.title && formik.errors.source_schema && formik.errors.source_schema.title}
                                    label="Title"
                                    name="source_schema.title"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.source_schema.title}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.source_schema && formik.touched.source_schema.description && formik.errors.source_schema.description)}
                                    fullWidth
                                    minRows={5}
                                    multiline
                                    //helperText={formik.touched.source_schema && formik.touched.source_schema.description && formik.errors.source_schema.description}
                                    label="Description"
                                    name="source_schema.description"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.source_schema.description}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.source_schema && formik.touched.source_schema.version && formik.errors.source_schema.version)}
                                    fullWidth
                                    //helperText={formik.touched.source_schema && formik.touched.source_schema.version && formik.errors.source_schema.version}
                                    label="Version"
                                    name="source_schema.version"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.source_schema.version}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    error={!!(formik.touched.source_schema && formik.touched.source_schema.type && formik.errors.source_schema && formik.errors.source_schema.type)}
                                    id="ssType"
                                    fullWidth
                                    select
                                    defaultValue="JSON"
                                    helperText={formik.touched.source_schema && formik.touched.source_schema.type && formik.errors.source_schema && formik.errors.source_schema.type}
                                    label="Type"
                                    name="source_schema.type"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.source_schema.type}
                                >
                                    {sourceSchemaTypes.map((option) => (
                                        <MenuItem key={option.value}
                                                  value={option.value}>
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    xs={12}
                    md={6}
                >
                    <Card>
                        <CardHeader title="Target Ontology"/>
                        <CardContent sx={{pt: 0}}>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.target_ontology && formik.touched.target_ontology.title && formik.errors.target_ontology && formik.errors.target_ontology.title)}
                                    fullWidth
                                    //helperText={formik.touched.target_ontology && formik.touched.target_ontology.title && formik.errors.target_ontology && formik.errors.target_ontology.title}
                                    label="Title"
                                    name="target_ontology.title"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.target_ontology.title}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.target_ontology && formik.touched.target_ontology.description && formik.errors.target_ontology.description)}
                                    fullWidth
                                    minRows={5}
                                    multiline
                                    //helperText={formik.touched.target_ontology && formik.touched.target_ontology.description && formik.errors.target_ontology.description}
                                    label="Description"
                                    name="target_ontology.description"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.target_ontology.description}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.target_ontology && formik.touched.target_ontology.version && formik.errors.target_ontology.version)}
                                    fullWidth
                                    //helperText={formik.touched.target_ontology && formik.touched.target_ontology.version && formik.errors.target_ontology.version}
                                    label="Version"
                                    name="target_ontology.version"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.target_ontology.version}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    //error={!!(formik.touched.target_ontology && formik.touched.target_ontology.uri && formik.errors.target_ontology.uri)}
                                    fullWidth
                                    //helperText={formik.touched.target_ontology && formik.touched.target_ontology.uri && formik.errors.target_ontology.uri}
                                    label="URI"
                                    name="target_ontology.uri"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.target_ontology.uri}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
                        id="create_button"
                        disabled={formik.isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        {itemctx.isNew ? 'Create' : 'Update'}
                    </Button>
                    <Button
                        id="cancel_button"
                        color="inherit"
                        component={RouterLink}
                        disabled={formik.isSubmitting}
                        href={paths.app.projects.index}
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
