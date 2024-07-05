import {useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {Box} from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CMCard from "../../../../sections/app/cm-rules-list/cm-card";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {BreadcrumbsSeparator} from "../../../../components/breadcrumbs-separator";
import Link from "@mui/material/Link";
import {RouterLink} from "../../../../components/router-link";
import {paths} from "../../../../paths";

const Page = () => {
    const detailsDialog = useDialog();

    usePageView();

    return (
        <>
            <Seo title="App: CM Review"/>

            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4
                }}
            >
                <Grid xs={12}>
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            Review {sectionApi.SECTION_TITLE}
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
                                href={paths.app[sectionApi.section].review.index}
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TITLE}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                </Grid>
                <Grid
                    xs={12}
                    md={12}
                >
                    <Stack
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <Card>
                            <TextField select
                                       fullWidth>

                            </TextField>
                            <CMCard/>
                            <CMCard/>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
            <Dialog
              open={detailsDialog.open}
              onClose={detailsDialog.handleClose}
              fullWidth
              maxWidth='xl'
            >
                <DialogTitle>
                    {detailsDialog.data?.fileName}
                </DialogTitle>
                <DialogContent>
                    {
                        detailsDialog.data?.load ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginY:10 }}>
                                <CircularProgress />
                            </Box>:
                            <SyntaxHighlighter
                                language="xml"
                                wrapLines
                                lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
                                {detailsDialog.data?.content}
                            </SyntaxHighlighter>
                    }
                </DialogContent>
            </Dialog>

        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
