import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {ontologyTermsApi as sectionApi} from 'src/api/ontology-terms';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import OntologyTerms from "../../../sections/app/ontology/ontology-terms";
import SearchIcon from "@untitled-ui/icons-react/build/esm/SearchRefraction";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {useRouter} from "src/hooks/use-router";
import OntologyNamespacesCustom from "../../../sections/app/ontology/ontology-namespaces-custom";
import OntologyNamespaces from "../../../sections/app/ontology/ontology-namespaces";
import Grid from "@mui/material/Grid";


const Page = () => {

    const router = useRouter()
    const handleDiscover = () => {
        const toastId = toastLoad('Discovering terms ...')
        sectionApi.discoverTerms()
            .then(res => {
                toastSuccess(`${res.task_name} successfully started.`, toastId)
                router.reload()
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
                        item
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
                                id="add_button"
                                component={RouterLink}
                                href={paths.app[sectionApi.section].create}
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
                          lg={12}
                          xl={6}
                    >
                        <OntologyNamespacesCustom/>
                    </Grid>
                    <Grid item
                          lg={12}
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
