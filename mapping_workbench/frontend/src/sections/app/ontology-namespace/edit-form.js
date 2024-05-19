import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Switch from "@mui/material/Switch";
import MenuList from "@mui/material/MenuList";
import Stack from '@mui/material/Stack';
import FormControlLabel from "@mui/material/FormControlLabel";

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';

import {FormTextField} from "../../../components/app/form/text-field";
import {getToastId, toastError, toastSuccess} from "../../../components/app-toast";
import {sessionApi} from "../../../api/session";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const initialValues = {
        prefix: item.prefix ?? '',
        uri: item.uri ?? '',
        is_syncable: item.is_syncable !== null ? item.is_syncable : true
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            prefix: Yup
                .string()
                .max(255)
                .required('Prefix is required'),
            uri: Yup.string().max(2048),
            is_syncable: Yup.boolean()
        }),
        onSubmit: async (values, helpers) => {
            const toastId = getToastId()
            try {
                let response;
                values['project'] = sessionApi.getSessionProject();
                values['is_syncable'] = values['is_syncable'] || false;
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
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="prefix"
                                           label="Prefix"
                                           required={true}/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="uri"
                                           label="URI"/>
                        </Grid>
                        <MenuList>
                            <MenuItem key={0}>
                                <FormControlLabel
                                    sx={{
                                        width: '100%'
                                    }}
                                    control={
                                        <Switch
                                            checked={formik.values.is_syncable}
                                            onChange={(event) => formik.setFieldValue('is_syncable', event.target.checked)}
                                        />
                                    }
                                    label="Syncable"
                                />
                            </MenuItem>
                        </MenuList>
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
                        href={paths.app.ontology_namespaces.index}
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
