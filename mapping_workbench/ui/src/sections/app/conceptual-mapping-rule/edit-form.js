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
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {sparqlTestFileResourcesApi} from "../../../api/sparql-test-suites/file-resources";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const router = useRouter();

    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const prepareTextareaListValue = (value) => {
        return (value && (value.join('\n') + ['\n'])) || ''
    }

    let initialValues = {
        business_id: item.business_id || '',
        business_title: item.business_title || '',
        business_description: item.business_description || '',
        source_xpath: prepareTextareaListValue(item.source_xpath),
        target_class_path: item.target_class_path || '',
        target_property_path: item.target_property_path || '',
        mapping_packages: (item.mapping_packages || []).map(x => x.id),
        sparql_assertions: (item.sparql_assertions || []).map(x => x.id),
        triple_map_fragment: (item.triple_map_fragment && item.triple_map_fragment.id) || null
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
                    values['source_xpath'].split('\n').map(s => s.trim()).filter(s => s !== '') : values['source_xpath'];
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
                        formik.values.source_xpath = prepareTextareaListValue(response['source_xpath']);
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

    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);
    useEffect(() => {
        (async () => {
            setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
        })()
    }, [genericTripleMapFragmentsApi])

    const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);
    useEffect(() => {
        (async () => {
            setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleResources());
        })()
    }, [sparqlTestFileResourcesApi])

    const handleTripleMapFragmentSelect = useCallback((e) => {
        let value = e.target.value;
        formik.setFieldValue('triple_map_fragment', value);
    }, [formik]);

    const sparqlResourcesForSelector = function(filters = {}) {
        return sparqlTestFileResourcesApi.getMappingRuleResources(filters);
    }

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
                            <FormTextArea formik={formik} name="source_xpath" label="Source XPaths"/>
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
                <CardHeader title="RML Triple Map"/>
                <CardContent sx={{pt: 0}}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <FormControl sx={{my: 2, width: '100%'}}>
                                <TextField
                                    fullWidth
                                    label={genericTripleMapFragmentsApi.SECTION_ITEM_TITLE}
                                    onChange={handleTripleMapFragmentSelect}
                                    select
                                    value={formik.values.triple_map_fragment}
                                >
                                    <MenuItem key="" value={null}>&nbsp;</MenuItem>
                                    {projectTripleMapFragments.map((x) => (
                                        <MenuItem key={x.id} value={x.id}>{x.uri}</MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>
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
                <CardHeader title="SPARQL Assertions"/>
                <CardContent sx={{pt: 0}}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <ResourceListSelector
                                valuesApi={sparqlTestFileResourcesApi}
                                listValues={formik.values.sparql_assertions}
                                initProjectValues={projectSPARQLResources}
                                titleField="title"
                                valuesForSelector={sparqlResourcesForSelector}
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
