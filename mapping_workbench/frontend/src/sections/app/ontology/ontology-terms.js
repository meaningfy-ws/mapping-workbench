import {useEffect, useState} from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import {Filter} from "src/sections/components/filter";
import useItemsSearch from 'src/hooks/use-items-search';
import {ListTable} from "src/sections/app/ontology-term/list-table";
import {ontologyTermsApi as sectionApi} from "src/api/ontology-terms";
import {TableSearchBar} from "src/sections/components/table-search-bar";

const filterValues = [{label: 'All', value: ''},
    {label: 'CLASS', value: 'CLASS'},
    {label: 'PROPERTY', value: 'PROPERTY'}]

const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems()
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count
                }))
            .catch(err => console.warn(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        ...state
    };
};

const OntologyTerms = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ["short_term", "term"], {type: ''});

    return (
        <Stack spacing={4}>
            <Typography variant='h5'>Terms</Typography>
            <Card>
                <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                value={itemsSearch.state.search[0]}
                                placeholder='Search Terms'/>
                <Divider/>
                <Filter values={filterValues}
                        value={itemsSearch.state.filters.type}
                        onValueChange={(e) => itemsSearch.handleFiltersChange({type: e})}/>
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
}

export default OntologyTerms