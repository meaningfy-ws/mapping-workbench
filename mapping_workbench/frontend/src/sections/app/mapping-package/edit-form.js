
import {useState} from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
import {shaclTestSuitesApi} from "src/api/shacl-test-suites";
import {FormTextArea} from "src/components/app/form/text-area";
import {sparqlTestSuitesApi} from "src/api/sparql-test-suites";
import {FormTextField} from "src/components/app/form/text-field";
import {resourceCollectionsApi} from "src/api/resource-collections";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {ListSelectorSelect as ResourceListSelector} from "src/components/app/list-selector/select";


export const EditForm = (props) => {
    const {itemctx, ...other} = props;
    const [currentTab, setCurrentTab] = useState('tabEdit')
    const router = useRouter();
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const initialValues = {
        title: item.title || '',
        description: item.description || '',
        identifier: item.identifier || '',
        mapping_version: item.mapping_version || '',
        epo_version: item.epo_version || '',
        eform_subtypes: item.eform_subtypes || '',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        eforms_sdk_versions: item.eforms_sdk_versions || '',
        //test_data_suites: (item.test_data_suites || []).map(x => x.id),
        shacl_test_suites: (item.shacl_test_suites || []).map(x => x.id),
        sparql_test_suites: (item.sparql_test_suites || []).map(x => x.id),
        resource_collections: (item.resource_collections || []).map(x => x.id)
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048),
            identifier: Yup.string().max(255).required('Identifier is required')
        }),
        onSubmit: async (values, helpers) => {
            const toastId = toastLoad(itemctx.isNew ? "Updating..." : "Creating...")
            try {
                values['eform_subtypes'] = (typeof values['eform_subtypes'] == 'string') ?
                    values['eform_subtypes'].split(',').map(s => s.trim()) : values['eform_subtypes'];
                values['eforms_sdk_versions'] = (typeof values['eforms_sdk_versions'] == 'string') ?
                    values['eforms_sdk_versions'].split(',').map(s => s.trim()) : values['eforms_sdk_versions'];
                values['start_date'] = values['start_date'] || null;
                values['end_date'] = values['end_date'] || null;

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

        <form onSubmit={formik.handleSubmit}
              {...other}>
            {!itemctx.isNew && <Tabs value={currentTab}
                                     onChange={(e, v) => setCurrentTab(v)}>
                <Tab label='Edit Details'
                     value='tabEdit'></Tab>
                <Tab label='Edit Resources'
                     value='tabResources'></Tab>
            </Tabs>}
            {currentTab === 'tabEdit' &&
                <Card sx={{mt: 3}}>
                    <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
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
                                               name="identifier"
                                               label="Identifier"
                                               required/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="mapping_version"
                                               label="Mapping Version"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="epo_version"
                                               label="EPO Version"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="eform_subtypes"
                                               label="eForms Subtype"/>
                            </Grid>
                            <Grid xs={12}
                                  md={6}>
                                <FormTextField formik={formik}
                                               name="start_date"
                                               label="Start Date"
                                               helperText="YYYY-MM-DD"
                                />
                            </Grid>
                            <Grid xs={12}
                                  md={6}>
                                <FormTextField formik={formik}
                                               name="end_date"
                                               label="End Date"
                                               helperText="YYYY-MM-DD"
                                />
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="eforms_sdk_versions"
                                               label="eForms XSD version"/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            }

            {currentTab === 'tabResources' &&
                <>
                    <Card sx={{mt: 3}}>
                        <CardHeader title={shaclTestSuitesApi.SECTION_TITLE}/>
                        <CardContent sx={{pt: 0}}>
                            <Grid container
                                  spacing={3}>
                                <Grid xs={12}
                                      md={12}>
                                    <ResourceListSelector
                                        valuesApi={shaclTestSuitesApi}
                                        listValues={formik.values.shacl_test_suites}/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 3}}>
                        <CardHeader title={sparqlTestSuitesApi.SECTION_TITLE}/>
                        <CardContent sx={{pt: 0}}>
                            <Grid container
                                  spacing={3}>
                                <Grid xs={12}
                                      md={12}>
                                    <ResourceListSelector
                                        valuesApi={sparqlTestSuitesApi}
                                        listValues={formik.values.sparql_test_suites}/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 3}}>
                        <CardHeader title={resourceCollectionsApi.SECTION_TITLE}/>
                        <CardContent sx={{pt: 0}}>
                            <Grid container
                                  spacing={3}>
                                <Grid xs={12}
                                      md={12}>
                                    <ResourceListSelector
                                        valuesApi={resourceCollectionsApi}
                                        listValues={formik.values.resource_collections}/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </>
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
