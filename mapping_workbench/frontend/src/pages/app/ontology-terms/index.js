import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from "@mui/material/Unstable_Grid2";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import OntologyTerms from "src/sections/app/ontology/ontology-terms";
import {ontologyTermsApi as sectionApi} from 'src/api/ontology-terms';
import {SourceAndTargetTabs} from 'src/sections/app/source-and-target';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";

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
            <Seo title={`App: ${sectionApi.SECTION_TITLE}`}/>
            <Grid container
                  spacing={{xs: 3, lg: 4}}
            >

                <Grid xs={12}>
                    <SourceAndTargetTabs/>
                </Grid>
                <Grid xs={12}
                      direction="row"
                      justifyContent="space-between"
                      spacing={4}
                >

                    <Stack justifyContent='end'
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
                            variant="text"
                        >
                            Discover Terms
                        </Button>
                        <Button
                            id="add_term_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Add Term
                        </Button>
                    </Stack>
                </Grid>
                <Grid xs={12}>
                    <OntologyTerms/>
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
