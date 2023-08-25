import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {useCallback} from "react";
import {sessionApi} from "../../../api/session";
import FormControl from "@mui/material/FormControl";
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";


export const FileCollectionEditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;
    let customPathName = "";

    const handleResourceManagerAction = useCallback(async () => {
        router.push({
            pathname: paths.app[itemctx.api.section].resource_manager.index,
            query: {id: item._id}
        });

    }, [router, itemctx]);

    let initialValues = {
        title: item.title || '',
        description: item.description || '',
        submit: null
    };

    if (sectionApi.hasFileCollectionType) {
        initialValues['type'] = item.type || '';
    }

    switch (sectionApi.section) {
        case 'test_data_suites':
            customPathName = paths.app.test_data_suites.index;
            break;
        case 'sparql_test_suites':
            customPathName = paths.app.sparql_test_suites.index;
            break;
        case 'shacl_test_suites':
            customPathName = paths.app.shacl_test_suites.index;
            break;
        case 'ontology_file_collections':
            customPathName = paths.app.ontology_file_collections.index;
            break;
        case 'resource_collections':
            customPathName = paths.app.resource_collections.index;
            break;

        default:
            break;
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048)
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
                            pathname: paths.app[sectionApi.section].edit,
                            query: {id: response._id}
                        });
                    } else if (itemctx.isStateable) {
                        itemctx.setState(response);
                    }
                    //router.push({pathname: customPathName});
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
                <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                <CardContent sx={{pt: 0}}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={12}
                        >
                            <TextField
                                error={!!(formik.touched.title && formik.errors.title)}
                                fullWidth
                                helperText={formik.touched.title && formik.errors.title}
                                label="Title"
                                name="title"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                required
                                value={formik.values.title}
                            />
                        </Grid>
                        {sectionApi.hasFileCollectionType && (
                            <Grid xs={12} md={12}>
                                <TextField
                                    error={!!(formik.touched.type && formik.errors.type)}
                                    fullWidth
                                    helperText={formik.touched.type && formik.errors.type}
                                    onBlur={formik.handleBlur}
                                    label="Type"
                                    onChange={e => {
                                        formik.setFieldValue("type", e.target.value);
                                    }}
                                    select
                                    value={formik.values.type}
                                >
                                    <MenuItem key="" value={null}>&nbsp;</MenuItem>
                                    {Object.keys(sectionApi.FILE_COLLECTION_TYPES).map((key) => (
                                        <MenuItem key={key} value={key}>
                                            {sectionApi.FILE_COLLECTION_TYPES[key]}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        <Grid
                            xs={12}
                            md={12}
                        >
                            <TextField
                                error={!!(formik.touched.description && formik.errors.description)}
                                minRows={5}
                                multiline
                                fullWidth
                                helperText={formik.touched.description && formik.errors.description}
                                label="Description"
                                name="description"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                        </Grid>
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
                        variant="contained"
                        color="info"
                        onClick={handleResourceManagerAction}
                    >
                        Resources
                    </Button>}
                    <Button
                        color="inherit"
                        component={RouterLink}
                        disabled={formik.isSubmitting}
                        href={paths.app[sectionApi.section].index}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Card>
        </form>
    );
};

FileCollectionEditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
