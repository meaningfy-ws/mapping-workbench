import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import {FormTextField} from "src/components/app/form/text-field";
import {ForItemCreateForm} from "src/contexts/app/section/for-item-form";
import {FileResourceEditForm} from 'src/sections/app/file-manager/file-resource-edit-form';
import {testDataFileResourcesApi as sectionApi} from 'src/api/test-data-suites/file-resources';

const ExtraForm = (props) => {
    const {
        item,
        formik
    } = props;

    return (
        <Stack gap={3}>
            <Grid xs={12}
                  md={12}>
                <FormTextField formik={formik}
                               name="identifier"
                               label="Identifier"
                               required/>
            </Grid>
        </Stack>
    )
}

const Page = () => {
    const router = useRouter();
    usePageView();

    if (!router.isReady) return;

    const {id} = router.query;

    if (!id) return;

    let item = {};

    const extra_form_fields = {
        identifier: item.identifier || ''
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} Create`}/>
            <Stack spacing={4}>
                <Stack spacing={4}>
                    <div>
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={{
                                pathname: paths.app[sectionApi.section].resource_manager.index,
                                query: {id}
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
                </Stack>
                <FileResourceEditForm
                    itemctx={new ForItemCreateForm(item, sectionApi)}
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
