import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Unstable_Grid2";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import {ontologyTermsApi as sectionApi} from 'src/api/ontology-terms';
import {SourceAndTargetTabs} from 'src/sections/app/source-and-target';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import useItemsSearch from '../../../hooks/use-items-search';
import {useItemsStore} from '../../../hooks/use-items-store';
import {ListTable} from '../../../sections/app/ontology-term/list-table';
import {Filter} from '../../../sections/components/filter';
import {TableSearchBar} from '../../../sections/components/table-search-bar';

const filterValues = [{label: 'All', value: ''},
    {label: 'CLASS', value: 'CLASS'},
    {label: 'PROPERTY', value: 'PROPERTY'}]

const Page = () => {
    const router = useRouter()

    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ["short_term", "term"], {type: ''});

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
                <Grid xs={12}>
                    <Stack direction="row"
                           justifyContent="space-between"
                    >
                        <Card>
                            <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                            value={itemsSearch.state.search[0]}
                                            placeholder='Search Terms'/>
                        </Card>
                        <Stack justifyContent='end'
                               alignItems="center"
                               direction="row"
                               spacing={3}
                        >
                            <Button
                                id="discover_button"
                                onClick={handleDiscover}
                                startIcon={<SearchIcon/>}
                                variant="text"
                            >
                                Discover Terms
                            </Button>
                            <Button
                                id="add_term_button"
                                component={RouterLink}
                                href={paths.app[sectionApi.section].create}
                                startIcon={<AddIcon/>}
                                variant="contained"
                            >
                                Add Term
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid xs={12}>
                    <Card>
                        <Filter title='Type:'
                                values={filterValues}
                                value={itemsSearch.state.filters.type}
                                onValueChange={e => itemsSearch.handleFiltersChange({type: e})}/>
                        <Divider/>
                        <ListTable
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            sort={itemsSearch.state.sort}
                            onSort={itemsSearch.handleSort}
                            page={itemsSearch.state.page}
                            items={itemsSearch.pagedItems}
                            count={itemsStore.itemsCount}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            sectionApi={sectionApi}
                        />
                    </Card>

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
