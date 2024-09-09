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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";

import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {useProjects} from "src/hooks/use-projects";
import {RouterLink} from 'src/components/router-link';
import {FormTextField} from "src/components/app/form/text-field";
import {FormTextArea} from "src/components/app/form/text-area";
import {fieldsRegistryApi} from "src/api/fields-registry";
import {ontologyTermsApi} from "src/api/ontology-terms";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {Box} from "@mui/system";
import {mappingPackagesApi} from "../../../api/mapping-packages";
import ConfirmDialog from "../../../components/app/dialog/confirm-dialog";
import {useState} from "react";

export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const sectionApi = itemctx.api;
    const item = itemctx.data;
    const projectsStore = useProjects()
    const [confirmOpen, setConfirmOpen] = useState(false);

    const sourceSchemaTypes = [
        {
            value: 'JSON',
            label: 'JSON (eForms)'
        },
        {
            value: 'XSD',
            label: 'XSD'
        }
    ];

    const initialValues = {
        title: item.title ?? '',
        description: item.description ?? '',
        version: item.version ?? '',
        with_default_mapping_package: true,
        automatically_discover_namespaces: false,
        //add_specific_namespaces: false,
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
            checked: false,
            github_repository_url: '',
            branch_or_tag_name: '',
        }
    }


    const handleDiscoverNamespaces = () => {
        const toastId = toastLoad('Discovering terms ...')
        ontologyTermsApi.discoverTerms()
            .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
            .catch(err => toastError(`Discovering terms failed: ${err.message}.`, toastId))
    };

    const handleImportFieldRegistry = (values, projectId) => {
        const toastId = toastLoad(`Importing eForm Fields ... `)
        fieldsRegistryApi.importEFormsFromGithub({
            ...values,
            project_id: projectId,
            checked: undefined
        })
            .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
            .catch(err => toastError(`eForm Fields import failed: ${err.message}.`, toastId))
    }

    const handleDeleteProject = () => {
        projectsStore.handleDeleteProject(item._id)
    }

    // const handleCreateNamespaces = () => {
    //     const namespaces = [
    //         {prefix: 'epo', uri: 'http://data.europa.eu/a4g/ontology#', is_syncable: false},
    //         {prefix: 'epo-not', uri: 'http://data.europa.eu/a4g/ontology#', is_syncable: false},
    //         {prefix: 'cpov', uri: 'http://data.europa.eu/a4g/ontology#', is_syncable: false},
    //         {prefix: 'dct', uri: 'http://data.europa.eu/a4g/ontology#', is_syncable: false}
    //     ]
    //
    //     const toastId = toastLoad(`Creating Namespaces`)
    //     ontologyNamespacesApi.createNamespaces(namespaces)
    //         .then(res => toastSuccess(`Namespaces Created.`, toastId))
    //         .catch(err => toastError(err.message, toastId))
    // }

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048),
            version: Yup.string().max(255)
        }),

        onSubmit: async (values, helpers) => {
            const toastId = toastLoad(itemctx.isNew ? "Creating..." : "Updating...")
            const {
                with_default_mapping_package,
                automatically_discover_namespaces,
                //add_specific_namespaces,
                import_eform,
                ...projectValues
            } = values
            try {
                let response;
                if (itemctx.isNew) {
                    response = await sectionApi.createItem(projectValues);
                    if (formik.values.with_default_mapping_package) {
                        await mappingPackagesApi.createDefault(response._id);
                        toastSuccess(`Default Package created`, toastId);
                    }
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
                        if (formik.values.source_schema.type === 'JSON') {
                            if (formik.values.import_eform.checked) {
                                handleImportFieldRegistry(import_eform, response._id)
                            }
                            if (formik.values.automatically_discover_namespaces) {
                                handleDiscoverNamespaces()
                                // if (formik.values.add_specific_namespaces) {
                                //     handleCreateNamespaces()
                                // }
                            }
                        }

                        projectsStore.handleSessionProjectChange(response._id)
                        // router.push({
                        //     pathname: paths.app[sectionApi.section].index,
                        // });
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
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {itemctx.isNew &&
                <Card sx={{mt: 3}}>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <FormGroup sx={{mt: 3, ml: 2}}>
                                <FormControlLabel
                                    control={<Checkbox checked={formik.values.with_default_mapping_package}
                                                       onChange={formik.handleChange}
                                                       name="with_default_mapping_package"/>
                                    }
                                    label={<Typography variant='h6'>Create DEFAULT Package</Typography>}

                                />
                            </FormGroup>
                        </Grid>
                        {formik.values.source_schema.type === 'JSON' &&
                            <Box sx={{mt: 3}}>
                                <hr/>
                                <Grid container
                                      spacing={3}>
                                    <FormGroup sx={{mt: 2, ml: 2}}>
                                        <FormControlLabel
                                            control={<Checkbox checked={formik.values.automatically_discover_namespaces}
                                                               onChange={formik.handleChange}
                                                               name="automatically_discover_namespaces"/>
                                            }
                                            label={<Typography variant='h6'>Automatically discover
                                                namespaces</Typography>}

                                        />
                                        {/*<FormControlLabel*/}
                                        {/*    control={<Checkbox checked={formik.values.add_specific_namespaces}*/}
                                        {/*                       onChange={formik.handleChange}*/}
                                        {/*                       name="add_specific_namespaces"/>*/}
                                        {/*    }*/}
                                        {/*    label={<Typography variant='h6'>Add eForms-specific (ePO)*/}
                                        {/*        namespaces</Typography>}*/}
                                        {/*/>*/}
                                        <FormControlLabel
                                            control={<Checkbox checked={formik.values.import_eform.checked}
                                                               onChange={formik.handleChange}
                                                               name="import_eform.checked"/>
                                            }
                                            label={<Typography variant='h6'>Import eForms SDK from GitHub</Typography>}
                                        />
                                    </FormGroup>
                                    {formik.values.import_eform.checked &&
                                        <>
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
                                        </>
                                    }
                                </Grid>
                            </Box>
                        }
                    </CardContent>
                </Card>
            }

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
                    {!itemctx.isNew && <Button
                        id="delete_button"
                        color='error'
                        onClick={() => setConfirmOpen(true)}
                        disabled={formik.isSubmitting}>
                        Delete
                    </Button>}
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
            <ConfirmDialog
                title="Delete It?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={handleDeleteProject}
            >
                Are you sure you want to delete this project?
            </ConfirmDialog>
        </form>
    )
        ;
};

EditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
