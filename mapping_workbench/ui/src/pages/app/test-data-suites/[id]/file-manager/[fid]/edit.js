import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {testDataFileResourcesApi as sectionApi} from 'src/api/test-data-suites/file-resources';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {FileResourceEditForm} from 'src/sections/app/file-manager/file-resource-edit-form';
import {ForItemEditForm} from "src/contexts/app/section/for-item-form";
import {ForItemDataState} from "src/contexts/app/section/for-item-data-state";
import {useRouter} from "src/hooks/use-router";
import {useMounted} from "../../../../../../hooks/use-mounted";
import {useCallback, useEffect, useState} from "react";

const useItem = (sectionApi, id) => {
    const isMounted = useMounted();
    const [item, setItem] = useState(null);

    const handleItemGet = useCallback(async () => {
        try {
            const response = await sectionApi.getFileResource(id);
            if (isMounted()) {
                setItem(response);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted]);

    useEffect(() => {
            handleItemGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return new ForItemDataState(item, setItem);
};

const Page = () => {
    const router = useRouter();
    if (!router.isReady) return;

    const {id, fid} = router.query;

    if (!id || !fid) {
        return;
    }

    const formState = useItem(sectionApi, fid);
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
                                    href={{
                                        pathname: paths.app[sectionApi.section].file_manager.index,
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
                        <FileResourceEditForm itemctx={new ForItemEditForm(item, sectionApi, formState.setState)}
                                              collection_id={id}/>
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
