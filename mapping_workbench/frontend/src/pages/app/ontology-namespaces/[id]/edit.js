import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {useItem} from "src/contexts/app/section/for-item-data-state";
import {EditForm} from 'src/sections/app/ontology-namespace/edit-form';
import {ForItemEditForm} from "src/contexts/app/section/for-item-form";
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';


const Page = () => {
    const router = useRouter();
    const {id} = router.query;

    const formState = useItem(sectionApi, id);
    const item = formState.item;

    usePageView();

    if (!item) {
        return;
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
                            href={paths.app.ontology_namespaces.index}
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
                                    {item.prefix}
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
                <EditForm itemctx={new ForItemEditForm(item, sectionApi, formState.setState)}/>
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
