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
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import {
    GenericTripleMapFragmentListSelector
} from "../generic-triple-map-fragment/components/generic-triple-map-fragment-list-selector";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();

    const sectionApi = itemctx.api;
    const item = itemctx.data;

    let initialValues = {
        business_id: item.business_id || '',
        business_title: item.business_title || '',
        business_description: item.business_description || '',
        source_xpath: item.source_xpath || '',
        target_class_path: item.target_class_path || '',
        target_property_path: item.target_property_path || '',
        mapping_packages: (item.mapping_packages || []).map(x => x.id),
        triple_map_fragments: (item.triple_map_fragments || []).map(x => x.id)
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            business_id: Yup
                .string()
                .max(255)
                .required('Business ID is required'),
            business_title: Yup
                .string()
                .max(255),
            business_description: Yup.string().max(2048)
        }),
        onSubmit: async (values, helpers) => {
            try {
                values['source_xpath'] = (typeof values['source_xpath'] == 'string') ?
                    values['source_xpath'].split(',').map(s => s.trim()) : values['source_xpath'];
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
                            <FormTextField formik={formik} name="business_id" label="Business ID" required={true}/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="business_title" label="Business Title"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextArea formik={formik} name="business_description" label="Business Description"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="source_xpath" label="Source XPath"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="target_class_path" label="Target Class Path"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="target_property_path" label="Target Property Path"/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{mt: 3}}>
                <CardHeader title="RML Triple Maps"/>
                <CardContent sx={{pt: 0}}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <GenericTripleMapFragmentListSelector
                                tripleMapFragments={formik.values.triple_map_fragments}/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{mt: 3}}>
                <CardHeader title="Mapping Packages"/>
                <CardContent sx={{pt: 0}}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <MappingPackageCheckboxList mappingPackages={formik.values.mapping_packages}/>
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
                        href={paths.app.conceptual_mapping_rules.index}
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
