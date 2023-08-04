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


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    let initialValues = {
        title: item.title || '',
        description: item.description || '',
        identifier: item.identifier || '',
        subtype: item.subtype || '',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        min_xsd_version: item.min_xsd_version || '',
        max_xsd_version: item.max_xsd_version || '',

    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048),
            identifier: Yup.string().max(255).required('Identifier is required')
        }),
        onSubmit: async (values, helpers) => {
            try {
                values['subtype'] = (typeof values['subtype'] == 'string') ?
                    values['subtype'].split(',').map(s => s.trim()) : values['subtype'];
                values['start_date'] = values['start_date'] || null;
                values['end_date'] = values['end_date'] || null;
                let response;
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
                        console.log(response);
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
                            <FormTextField formik={formik} name="title" label="Title" required={true}/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextArea formik={formik} name="description" label="Description"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="identifier" label="Identifier" required={true}/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="subtype" label="Sub-type"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField type="date" formik={formik} name="start_date" label="Start Date"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField type="date" formik={formik} name="end_date" label="End Date"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="min_xsd_version" label="Min XSD Version"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="max_xsd_version" label="Max XSD Version"/>
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
                        href={paths.app.mapping_packages.index}
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
