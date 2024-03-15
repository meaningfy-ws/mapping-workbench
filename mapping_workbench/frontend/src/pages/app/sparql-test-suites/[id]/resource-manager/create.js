import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from 'src/hooks/use-router';
import {Layout as AppLayout} from 'src/layouts/app';
import {sparqlTestFileResourcesApi as sectionApi} from 'src/api/sparql-test-suites/file-resources';
import {RouterLink} from 'src/components/router-link';
import {usePageView} from 'src/hooks/use-page-view';
import {FileResourceEditForm} from 'src/sections/app/file-manager/file-resource-edit-form';
import {ForItemCreateForm} from "src/contexts/app/section/for-item-form";

const Page = () => {
    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;

    if (!id) {
        return;
    }

    let item = {};

    usePageView();

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
                                query: {id: id}
                            }}
                            sx={{
                                alignItems: 'center',
                                display: 'inline-flex'
                            }}
                            underline="hover"
                        >
                            <SvgIcon sx={{mr: 1}}>
                                <ArrowLeftIcon/>
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Link>
                    </div>
                </Stack>
                <FileResourceEditForm itemctx={new ForItemCreateForm(item, sectionApi)}
                                      collection_id={id}/>
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
