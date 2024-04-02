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
import TextField from "@mui/material/TextField";

import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {RouterLink} from 'src/components/router-link';
import {FormTextField} from "../../../components/app/form/text-field";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const initialValues = {
        term: item.term ?? '',
        type: item.type ?? '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            term: Yup
                .string()
                .max(255)
                .required('Term is required')
        }),
        onSubmit: async (values, helpers) => {
            const toastId = toastLoad(itemctx.isNew ? "Creating..." : "Updating...")
            try {
                const requestValues = values;
                let response;
                requestValues['type'] = values['type'] || null;
                if (itemctx.isNew) {
                    response = await sectionApi.createItem(requestValues);
                } else {
                    requestValues['id'] = item._id;
                    response = await sectionApi.updateItem(requestValues);
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
                else throw 'Something went wrong!'
            } catch (err) {
                console.error(err);
                toastError('Something went wrong!', toastId);
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
                                           name="term"
                                           label="Term"
                                           required={true}/>
                        </Grid>
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
                                <MenuItem key="none"
                                          value="">&nbsp;</MenuItem>
                                {Object.keys(sectionApi.TERM_TYPES).map((key) => (
                                    <MenuItem key={key}
                                              value={key}>
                                        {sectionApi.TERM_TYPES[key]}
                                    </MenuItem>
                                ))}
                            </TextField>
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
                        href={paths.app.ontology_terms.index}
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
