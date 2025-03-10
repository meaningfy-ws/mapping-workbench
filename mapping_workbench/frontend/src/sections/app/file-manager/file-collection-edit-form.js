import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from "@mui/material/Typography";
import CardContent from '@mui/material/CardContent';

import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {sessionApi} from "src/api/session";
import {RouterLink} from 'src/components/router-link';
import {FormTextArea} from "src/components/app/form/text-area";
import {FormTextField} from "src/components/app/form/text-field";
import {toastError, toastSuccess} from "src/components/app-toast";
import {MappingPackageFormSelect} from "../mapping-package/components/mapping-package-form-select";
import {MappingPackageCheckboxList} from '../mapping-package/components/mapping-package-real-checkbox-list';


export const FileCollectionEditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;
    let customPathName = "";

    const handleResourceManagerAction = () =>
        router.push({
            pathname: paths.app[itemctx.api.section].resource_manager.index,
            query: {id: item._id}
        });

    const initialValues = {
        title: item.title ?? '',
        description: item.description ?? ''
    };

    if (sectionApi.hasFileCollectionType) {
        initialValues['type'] = item.type ?? null;
    }

    if (sectionApi.hasMappingPackage) {
        initialValues['mapping_package_id'] = item.mapping_package_id ?? '';
    }

    if (sectionApi.refersToMappingPackages && itemctx.isNew) {
        initialValues['refers_to_mapping_package_ids'] = item.refers_to_mapping_package_ids ?? [];
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
        case 'resource_collections':
            customPathName = paths.app.resource_collections.index;
            break;

        default:
            break;
    }

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048)
        }),
        onSubmit: async (values, helpers) => {
            const toastId = toast()
            try {
                let response;
                values['project'] = sessionApi.getSessionProject();
                if (sectionApi.hasMappingPackage) {
                    values['mapping_package_id'] = values['mapping_package_id'] || null;
                }
                if (sectionApi.refersToMappingPackages && itemctx.isNew) {
                    values['refers_to_mapping_package_ids'] = values['refers_to_mapping_package_ids'] || null;
                }
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
                    //router.push({pathname: customPathName});
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
                            <FormTextField formik={formik}
                                           name="title"
                                           label="Title"
                                           required/>
                        </Grid>
                        {sectionApi.hasMappingPackage && (
                            <Grid xs={12}
                                  md={12}>
                                <MappingPackageFormSelect
                                    formik={formik}
                                    isRequired={sectionApi.isMappingPackageRequired ?? false}
                                    withDefaultPackage={itemctx.isNew}
                                />
                            </Grid>
                        )}
                        {sectionApi.hasFileCollectionType && (
                            <Grid xs={12}
                                  md={12}>
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
                                    <MenuItem key=""
                                              value={null}>&nbsp;
                                    </MenuItem>
                                    {Object.keys(sectionApi.FILE_COLLECTION_TYPES).map(key =>
                                        <MenuItem key={key}
                                                  value={key}>
                                            {sectionApi.FILE_COLLECTION_TYPES[key]}
                                        </MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                        )}
                        <Grid
                            xs={12}
                            md={12}
                        >
                            <Grid xs={12}
                                  md={12}>
                                <FormTextArea formik={formik}
                                              name="description"
                                              label="Description"/>
                            </Grid>
                        </Grid>
                        {sectionApi.refersToMappingPackages && itemctx.isNew && (
                            <Grid xs={12}
                                  md={12}>
                                <Divider sx={{mb: 3}}/>
                                <Typography variant="subtitle2">
                                    Mapping Packages
                                </Typography>
                                <Grid container
                                      spacing={3}>
                                    <Grid xs={12}
                                          md={12}>
                                        <MappingPackageCheckboxList
                                            handleUpdate={values => formik.setFieldValue('refers_to_mapping_package_ids', values)}
                                            mappingPackages={formik.values.refers_to_mapping_package_ids}
                                            withDefaultPackage={itemctx.isNew}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
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
