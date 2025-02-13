import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {projectsApi as sectionApi} from 'src/api/projects';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {EditForm} from 'src/sections/app/project/edit-form';
import {ForItemCreateForm} from "src/contexts/app/section/for-item-form";


const Page = () => {
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
                            href={paths.index}
                            sx={{
                                alignItems: 'center',
                                display: 'inline-flex'
                            }}
                            underline="hover"
                            id='back_to_projects'
                        >
                            <SvgIcon sx={{mr: 1}}>
                                <ArrowLeftIcon/>
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                Overview
                            </Typography>
                        </Link>
                    </div>
                </Stack>
                <EditForm itemctx={new ForItemCreateForm(item, sectionApi)}/>
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
