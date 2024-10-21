import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import {paths} from 'src/paths';
import {sessionApi} from "src/api/session";
import {useRouter} from 'src/hooks/use-router';
import {RouterLink} from 'src/components/router-link';
import {FormTextField} from "src/components/app/form/text-field";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";

export const EditForm = (props) => {
        const {itemctx, ...other} = props;
        const router = useRouter();

        const sectionApi = itemctx.api;
        const item = itemctx.data;

        const initialValues = {
            sdk_element_id: item.sdk_element_id ?? '',
            absolute_xpath: item.absolute_xpath ?? '',
            relative_xpath: item.relative_xpath ?? '',
            parent_node_id: item.parent_node_id ?? '',
        };

        const formik = useFormik({
            initialValues,
            validationSchema: Yup.object({
                sdk_element_id: Yup
                    .string()
                    .required('SDK Element ID is required'),
                absolute_xpath: Yup
                    .string()
                    .required('Absolute XPATH is required')
            }),
            onSubmit: async (values, helpers) => {
                const toastId = toastLoad(itemctx.isNew ? 'Creating...' : 'Updating...')
                try {
                    const requestValues = values;

                    let response;
                    requestValues['project'] = sessionApi.getSessionProject();
                    if (itemctx.isNew) {
                        response = await sectionApi.createItem(requestValues);
                    } else {
                        requestValues['id'] = item._id;
                        response = await sectionApi.updateItem(requestValues);
                    }
                    helpers.setStatus({success: true});
                    helpers.setSubmitting(false);
                    toastSuccess('Element ' + (itemctx.isNew ? "Created" : "Updated"), toastId);
                    if (response) {
                        if (itemctx.isNew) {
                            router.push({
                                pathname: paths.app.fields_and_nodes.overview.index,
                            });
                        } else if (itemctx.isStateable) {
                            itemctx.setState(response);
                        }
                    }
                } catch (err) {
                    toastError(err, toastId);
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    helpers.setSubmitting(false);
                }
            }
        });


        return (
            <form onSubmit={formik.handleSubmit}
                  {...other}>
                <Card>
                    <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' Field'}/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="sdk_element_id"
                                               label="SDK Element ID"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="absolute_xpath"
                                               label="Absolute XPATH"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="relative_xpath"
                                               label="Relative XPATH"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="parent_node_id"
                                               label="Parent Node ID"/>
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
                        <Button
                            color="inherit"
                            component={RouterLink}
                            disabled={formik.isSubmitting}
                            href={paths.app.fields_and_nodes.overview.index}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Card>
            </form>
        )
            ;
    }
;

EditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
