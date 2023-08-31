import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {genericTripleMapFragmentsApi as sectionApi} from 'src/api/triple-map-fragments/generic';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {EditForm} from 'src/sections/app/generic-triple-map-fragment/edit-form';
import {ForItemCreateForm} from "src/contexts/app/section/for-item-form";


const Page = () => {
    let item = {};

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} Create`}/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack spacing={4}>
                            <div>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={paths.app[sectionApi.section].index}
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
                        <EditForm itemctx={new ForItemCreateForm(item, sectionApi)}/>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;