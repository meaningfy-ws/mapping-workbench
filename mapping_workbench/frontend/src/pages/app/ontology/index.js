import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import SearchIcon from "@untitled-ui/icons-react/build/esm/SearchRefraction";

import Link from '@mui/material/Link';
import Grid from "@mui/material/Grid";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {usePageView} from 'src/hooks/use-page-view';
import OntologyTerms from "src/sections/app/ontology/ontology-terms";
import {ontologyTermsApi as sectionApi} from 'src/api/ontology-terms';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import OntologyNamespaces from "src/sections/app/ontology/ontology-namespaces";
import OntologyNamespacesCustom from "src/sections/app/ontology/ontology-namespaces-custom";


const Page = () => {

    const router = useRouter()
    const handleDiscover = () => {
        const toastId = toastLoad('Discovering terms ...')
        sectionApi.discoverTerms()
            .then(res => {
                toastSuccess(`${res.task_name} successfully started.`, toastId)
                // router.reload()
            })
            .catch(err => toastError(`Discovering terms failed: ${err.message}.`, toastId))
    };

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Grid container
                  direction='column'
                  spacing={4}>
                <Grid item>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
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
                                    List
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={3}
                        >
                            <Button
                                id="discover_button"
                                onClick={handleDiscover}
                                startIcon={(
                                    <SvgIcon>
                                        <SearchIcon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Discover Terms
                            </Button>
                            <Button
                                id="add_term_button"
                                component={RouterLink}
                                href={paths.app.ontology.create}
                                startIcon={(
                                    <SvgIcon>
                                        <PlusIcon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Add Term
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item>
                    <OntologyTerms/>
                </Grid>
               <Grid container
                     item
                     spacing={4}
               >
                    <Grid item
                          xs={12}
                          xl={6}
                    >
                        <OntologyNamespacesCustom/>
                    </Grid>
                    <Grid item
                          xs={12}
                          xl={6}>
                        <OntologyNamespaces/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
