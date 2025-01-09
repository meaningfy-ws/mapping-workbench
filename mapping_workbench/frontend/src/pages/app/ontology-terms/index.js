import {useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
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
import {NavigationTabsWrapper} from '../../../components/navigation-tabs-wrapper';
import useItemsSearch from '../../../hooks/use-items-search';
import {useItemsStore} from '../../../hooks/use-items-store';
import {ListTable} from '../../../sections/app/ontology-term/list-table';
import {Filter} from '../../../sections/components/filter';
import {TableSearchBar} from '../../../sections/components/table-search-bar';

const FILTER_VALUES = [{label: 'All', value: ''},
    {label: 'CLASS', value: 'CLASS'},
    {label: 'PROPERTY', value: 'PROPERTY'}]

const Page = () => {
    const router = useRouter()

    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ["short_term", "term"], {type: ''});

    const [filterPopover, setFilterPopover] = useState(null)

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
            <NavigationTabsWrapper>
                <SourceAndTargetTabs/>
            </NavigationTabsWrapper>
            <Grid container
                  mt={5}
                  spacing={{xs: 3, lg: 4}}
            >
                <Grid xs={12}>
                    <Stack direction="row"
                           justifyContent="space-between"
                    >
                        <Stack direction='row'
                               spacing={3}>
                            <Paper>
                                <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                                value={itemsSearch.state.search[0]}
                                                placeholder='Search Terms'/>
                            </Paper>
                            <Paper>
                                <Button variant='text'
                                        color={itemsSearch.state.filters.type ? 'primary' : 'inherit'}
                                        onClick={e => setFilterPopover(e.currentTarget)}
                                        startIcon={<FilterListIcon/>}>Filter</Button>
                                <Popover
                                    id={'filter-popover'}
                                    open={!!filterPopover}
                                    anchorEl={filterPopover}
                                    onClose={() => setFilterPopover(null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Filter title='Type:'
                                            values={FILTER_VALUES}
                                            value={itemsSearch.state.filters.type}
                                            onValueChange={e => itemsSearch.handleFiltersChange({type: e})}/>
                                </Popover>
                            </Paper>
                        </Stack>
                        <Stack alignItems="center"
                               direction="row"
                               spacing={3}>
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
