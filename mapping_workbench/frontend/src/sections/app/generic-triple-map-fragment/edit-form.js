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

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {FormTextField} from "../../../components/app/form/text-field";
import {FormTextArea} from "../../../components/app/form/text-area";
import {sessionApi} from "../../../api/session";
import {FormCodeTextArea} from "../../../components/app/form/code-text-area";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import * as React from "react";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    let initialValues = {
        triple_map_uri: item.triple_map_uri || '',
        triple_map_content: item.triple_map_content || '',
        format: item.format || sectionApi.FILE_RESOURCE_DEFAULT_FORMAT || '',
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            triple_map_uri: Yup
                .string()
                .max(255)
                .required('URI is required'),
            triple_map_content: Yup.string().max(2048),
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
                            pathname: paths.app[sectionApi.section].edit,
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

    return (
        <form onSubmit={formik.handleSubmit} {...other}>
            <Card>
                <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                <CardContent sx={{pt: 0}}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="triple_map_uri" label="URI" required={true}/>
                        </Grid>
                        <Grid xs={12} md={12}>
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
                                    <MenuItem key={key} value={key}>
                                        {sectionApi.FILE_RESOURCE_FORMATS[key]}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormCodeTextArea
                                formik={formik}
                                name="triple_map_content"
                                label="Content"
                                grammar={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                language={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
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