import {useEffect, useState} from "react";

import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import {ListTable} from "./list-table";
import useItemsSearch from 'src/hooks/use-items-search';
import {TableSearchBar} from 'src/sections/components/table-search-bar';
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';

const useItemsStore = (id, searchState) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getStates(id)
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count
                })
            )
            .catch(err => console.warn(err))
    }


    useEffect(() => {
            id && handleItemsGet()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id]);

    return {
        ...state
    };
};

const SEARCH_COLUMNS = ['title', 'description']

const StatesView = ({id}) => {

    const itemsStore = useItemsStore(id);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, SEARCH_COLUMNS);

    return (
            <Stack spacing={3}>
                <Stack direction='row'>
                    <Paper>
                        <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                        value={itemsSearch.state.search[0]}/>
                    </Paper>
                </Stack>
                {
                    itemsStore.itemsCount ?
                        <ListTable
                            id={id}
                            items={itemsSearch.pagedItems}
                            count={itemsSearch.count}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            onSort={itemsSearch.handleSort}
                            sort={itemsSearch.state.sort}
                            page={itemsSearch?.state?.page}
                            rowsPerPage={itemsSearch?.state?.rowsPerPage}
                            sectionApi={sectionApi}
                        /> :
                        <Stack justifyContent="center"
                               direction="row">
                            <Alert severity="info">No Data !</Alert>
                        </Stack>
                }
            </Stack>
    )
}

export default StatesView