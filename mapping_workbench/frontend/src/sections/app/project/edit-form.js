import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox'

import {paths} from 'src/paths';
import {RouterLink} from 'src/components/router-link';
import {useRouter} from 'src/hooks/use-router';
import {FormTextField} from "../../../components/app/form/text-field";
import {FormTextArea} from "../../../components/app/form/text-area";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {useProjects} from "../../../hooks/use-projects";

export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;
    const projectsStore = useProjects()

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
        },
        import_eform: {
            checked: item.import_eform?.checked ?? true,
            github_repository_url: item.import_eform?.github_repository_url ?? '',
            branch_or_tag_name: item.import_eform?.branch_or_tag_name ?? '',
        }
    }


    ,
      validationSchema = {

      }

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
            const toastId = toastLoad(itemctx.isNew ? "Creating..." : "Updating...")
            const {import_eform: importEformValues, ...projectValues} = values
            try {
                console.log(values,projectValues)
                let response;
                if (itemctx.isNew) {
                    response = await sectionApi.createItem(projectValues);
                } else {
                    projectValues['id'] = item._id;
                    response = await sectionApi.updateItem(projectValues);
                }
                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toastSuccess(`${sectionApi.SECTION_ITEM_TITLE} ${itemctx.isNew ? "Created" : "Updated"}`, toastId);
                if (response) {
                    projectsStore.getProjects()
                    if (itemctx.isNew) {
                        projectsStore.handleSessionProjectChange(response._id)
                        router.push({
                            pathname: paths.app[sectionApi.section].index,
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

    console.log(formik)
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
                        <CardHeader title="Target Ontology"/>
                        <CardContent sx={{pt: 0}}>
                            <Grid
                                xs={12}
                                md={12}
                            >
                                <TextField
                                    fullWidth
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
                                    fullWidth
                                    minRows={5}
                                    multiline
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
                                    fullWidth
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
                                    fullWidth
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
                                    fullWidth
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
                                    fullWidth
                                    minRows={5}
                                    multiline
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
                                    fullWidth
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
                                    error={!!(formik.touched.source_schema?.type && formik.errors.source_schema?.type)}
                                    id="ssType"
                                    fullWidth
                                    select
                                    defaultValue="JSON"
                                    helperText={formik.touched.source_schema?.type && formik.errors.source_schema?.type}
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
            </Grid>
            {formik.values.source_schema.type === 'JSON' && <Card sx={{mt: 3}}>
                 <CardHeader title="Import eForms SDK from GitHub"
                             action={
                                <Checkbox checked={formik.values.import_eform.checked}
                                          name="import_eform.checked"
                                          onChange={formik.handleChange}/>
                             }>
                 </CardHeader>
                <CardContent sx={{pt: 0}}>
                    <Grid container
                          spacing={3}>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="import_eform.github_repository_url"
                                           label="GitHub Repository URL"
                                           disabled={!formik.values.import_eform.checked}
                                           required/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="import_eform.branch_or_tag_name"
                                           label="Branch or Tag name"
                                           disabled={!formik.values.import_eform.checked}
                                           required/>
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
