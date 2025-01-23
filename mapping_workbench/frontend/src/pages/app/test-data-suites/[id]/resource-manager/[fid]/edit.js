import {useCallback, useEffect, useState} from "react";
import {useFormik} from "formik";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from "@mui/material/Paper";
import SvgIcon from '@mui/material/SvgIcon';
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from '@mui/material/Typography';
import FormControlLabel from "@mui/material/FormControlLabel";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {FormTextField} from "src/components/app/form/text-field";
import {ForItemEditForm} from "src/contexts/app/section/for-item-form";
import CodeMirrorDefault, {CodeMirrorCompare} from "src/components/app/form/codeMirrorDefault";
import {ForItemDataState} from "src/contexts/app/section/for-item-data-state";
import {FileResourceEditForm} from 'src/sections/app/file-manager/file-resource-edit-form';
import {testDataFileResourcesApi as sectionApi} from 'src/api/test-data-suites/file-resources';
import {MappingPackageFormSelect} from 'src/sections/app/mapping-package/components/mapping-package-form-select';


const useItem = (sectionApi, id) => {
    const [item, setItem] = useState(null);

    const handleItemGet = () => {
        sectionApi.getFileResource(id)
            .then(res => setItem(res))
            .catch(err => console.error(err))
    }

    useEffect(() => {
            id && handleItemGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]);

    return new ForItemDataState(item, setItem);
};


const ExtraForm = (props) => {
    const {
        item,
        formik
    } = props;

    const handleTransformTestDataChange = useCallback((event) => {
        formik.setFieldValue('transform_test_data', event.target.checked);
    }, [formik]);

    return (
        <Stack gap={3}>
            <Grid xs={12}
                  md={12}>
                <FormTextField formik={formik}
                               name="identifier"
                               label="Identifier"
                               required/>
            </Grid>
            <Divider/>
            <Paper
                sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    px: 2,
                }}
                variant="outlined"
            >
                <FormControlLabel
                    sx={{
                        width: '100%'
                    }}
                    control={
                        <Checkbox
                            checked={formik.values.transform_test_data}
                            onChange={handleTransformTestDataChange}
                        />
                    }
                    label="Transform Test Data"
                    value=""
                />
            </Paper>
            <Grid xs={12}
                  md={12}>
                <MappingPackageFormSelect
                    formik={formik}
                    isRequired={sectionApi.isMappingPackageRequired ?? false}
                    withDefaultPackage={false}
                    disabled={!formik.values.transform_test_data}
                />
            </Grid>
            <Grid xs={12}
                  md={12}>
                {/*<CodeMirrorDefault label="RDF Manifestation"*/}
                {/*                   style={{resize: 'vertical', overflow: 'auto', height: 600}}*/}
                {/*                   value={formik.values.rdf_manifestation}*/}
                {/*                   onChange={value => formik.setValues('rdf_manifestation', value)}*/}
                {/*                   lang={'TTL'}*/}
                {/*/>*/}
                <CodeMirrorCompare label="RDF Manifestation"
                                   style={{resize: 'vertical', overflow: 'auto', height: 600}}
                                   value={formik.values.rdf_manifestation}
                                   onChange={value => formik.setValues('rdf_manifestation', value)}
                                   lang={'TTL'}
                />
            </Grid>
        </Stack>
    )
}

const Page = () => {
    const router = useRouter();
    const {id, fid} = router.query;

    const formState = useItem(sectionApi, fid);
    const item = formState.item;

    const formik = useFormik({
        initialValues: {"rdf_manifestation": item && item.rdf_manifestation}
    });

    usePageView();

    if (!item) {
        return;
    }

    const extra_form_fields = {
        identifier: item.identifier || '',
        rdf_manifestation: item.rdf_manifestation || '',
        transform_test_data: false,
        mapping_package_id: null
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} Edit`}/>
            <Stack spacing={4}>
                <Stack spacing={4}>
                    <div>
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={{
                                pathname: paths.app[sectionApi.section].resource_manager.index,
                                query: {id: id}
                            }}
                            sx={{
                                alignItems: 'center',
                                display: 'inline-flex'
                            }}
                            underline="hover"
                        >
                            <SvgIcon sx={{mr: 1}}>
                                <ArrowBackIcon/>
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Link>
                    </div>
                    <Stack
                        alignItems="flex-start"
                        direction={{
                            xs: 'column',
                            md: 'row'
                        }}
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    {item.title}
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Chip
                                        label={item._id}
                                        size="small"
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                </Stack>
                <FileResourceEditForm
                    itemctx={new ForItemEditForm(item, sectionApi, formState.setState)}
                    collection_id={id}
                    extra_form={ExtraForm}
                    extra_form_fields={extra_form_fields}
                />

            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
