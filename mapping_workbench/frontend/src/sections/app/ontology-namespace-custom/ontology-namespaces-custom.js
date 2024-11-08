import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {RouterLink} from 'src/components/router-link';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {ListTable} from "src/sections/app/ontology-namespace-custom/list-table";
import {ontologyNamespacesCustomApi as sectionApi} from 'src/api/ontology-namespaces-custom';
import useItemsSearch from '../../../hooks/use-items-search';
import {useItemsStore} from '../../../hooks/use-items-store';

const OntologyNamespacesCustom = () => {
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items,sectionApi,['prefix','uri'],{});

    return (
        <Stack spacing={4}>
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
            >
                <Stack spacing={1}>
                    <Typography variant="h5">
                        {sectionApi.SECTION_TITLE}
                    </Typography>
                </Stack>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={3}
                >
                    <Button
                        id="add_namespace_button"
                        component={RouterLink}
                        href={paths.app[sectionApi.section].create}
                        startIcon={(
                            <SvgIcon>
                                <AddIcon/>
                            </SvgIcon>
                        )}
                        variant="contained"
                    >
                        Add Namespace
                    </Button>
                </Stack>
            </Stack>
            <Card>
                <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                value={itemsSearch.state.search[0]}
                                placeholder='Search Namespaces'/>
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
        </Stack>
    )
};

export default OntologyNamespacesCustom;
