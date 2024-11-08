import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';

import {usePageView} from 'src/hooks/use-page-view';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {ListTable} from "src/sections/app/ontology-namespace/list-table";
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';

const OntologyNamespaces = () => {
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['prefix','uri']);

    usePageView();

    return (
        <Stack spacing={5}>
            <Typography variant="h5">
                Discovered Namespaces
            </Typography>
            <Card>
                <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                value={itemsSearch.state.search[0]}
                                placeholder='Search Discovered Namespaces'/>
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

export default OntologyNamespaces;
