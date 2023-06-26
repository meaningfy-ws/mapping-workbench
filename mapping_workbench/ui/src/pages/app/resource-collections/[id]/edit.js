import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

// to be deleted after demo
import { Card, Input } from '@mui/material';
import CardContent from '@mui/material';
import Grid from '@mui/material';
import TextField from '@mui/material';

import {resourceCollectionsApi as sectionApi} from 'src/api/resource-collections';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {FileCollectionEditForm} from 'src/sections/app/file-manager/file-collection-edit-form';
import {ForItemEditForm} from "src/contexts/app/section/for-item-form";
import {useItem} from "src/contexts/app/section/for-item-data-state";
import {useRouter} from "src/hooks/use-router";
import { packageCollectionsApi } from 'src/api/package-collections';
import { conceptualMappingCollectionsApi } from 'src/api/conceptual-mapping-collections';

const mockDataPackages = {
    title:"F03",
    description:"Des03",
    formType:"35",   
    minDate: "01/06/2023",
    maxDate: "23/06/2023",
    minVersion: "R2.08.55",
    maxVersion: "R2.09.66",
  };

  const mockDataConceptual = {
	title: "Conceptual Mapping Title",
	description: "Conceptual Mapping Description",
	sourceXpath: "Conceptual Mapping Source Xpath",
	targetClassPath: "Conceptual Mapping Source Xpath",
	targetPropertyPath: "Conceptual Mapping Target Property",
	testCollections: [
		"MRRegistry1",
		"MRRegistry2",
		"MRRegistry3",
		"MRRegistry4"
	]
};


const Page = () => {
    const router = useRouter();
    if(!router.isReady) return;

    const { id } = router.query;

    if (!id) {
        return;
    }

    const formState = useItem(sectionApi, id);
    const item = formState.item;

    usePageView();

    if (!item) {
        return;
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} Edit`}/>
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
                        <FileCollectionEditForm itemctx={new ForItemEditForm(item, sectionApi, formState.setState)}/>
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
