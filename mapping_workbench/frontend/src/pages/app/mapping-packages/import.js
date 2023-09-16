import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {Upload04 as ImportIcon} from "@untitled-ui/icons-react/build/esm";
import Button from "@mui/material/Button";
import {PackageImporter} from "../../../sections/app/mapping-package/package-importer";
import {useDialog} from "../../../hooks/use-dialog";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {BreadcrumbsSeparator} from "../../../components/breadcrumbs-separator";


const Page = () => {
    const importDialog = useDialog();
    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} Import`}/>
            <Stack spacing={4}>
                <Stack spacing={1}>
                    <Typography variant="h4">
                        {sectionApi.SECTION_TITLE}
                    </Typography>
                    <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={paths.index}
                            variant="subtitle2"
                        >
                            App
                        </Link>
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].index}
                            variant="subtitle2"
                        >
                            {sectionApi.SECTION_TITLE}
                        </Link>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            Import
                        </Typography>
                    </Breadcrumbs>
                </Stack>
            </Stack>
            <Stack
                alignItems="center"
                direction="row"
                pt={4}
            >
                <Button
                    onClick={importDialog.handleOpen}
                    startIcon={(
                        <SvgIcon>
                            <ImportIcon/>
                        </SvgIcon>
                    )}
                    variant="contained"
                >
                    Import
                </Button>
            </Stack>

            <PackageImporter
                onClose={importDialog.handleClose}
                open={importDialog.open}
                sectionApi={sectionApi}
            />
        </>
    )
        ;
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
