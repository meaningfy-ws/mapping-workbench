import {useEffect, useState} from "react";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import useItemsSearch from '../../../../hooks/use-items-search';
import {TableSearchBar} from '../../../components/table-search-bar';
import {ListTable} from "./list-table";
import {FileCollectionListSearch} from "../../file-manager/file-collection-list-search";

//
//
// const useItemsSearch = () => {
//     const [state, setState] = useState({
//         filters: {},
//         page: sectionApi.DEFAULT_PAGE,
//         rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE,
//         sortField: "",
//         sortDirection: undefined,
//     });
//
//     const handleFiltersChange = filters => {
//         setState(prevState => ({
//             ...prevState,
//             filters,
//             page: 0
//         }));
//     }
//
//     const handlePageChange = (event, page) => {
//         setState(prevState => ({
//             ...prevState,
//             page
//         }));
//     };
//
//     const handleRowsPerPageChange = (event) => {
//         setState(prevState => ({
//             ...prevState,
//             rowsPerPage: parseInt(event.target.value, 10)
//         }));
//     };
//
//     const handleSort = (sortField) => {
//         setState(prevState => ({...prevState, sortField, sortDirection: state.sortField === sortField && prevState.sortDirection === -1 ? 1 : -1 }))
//     }
//
//     return {
//         handleFiltersChange,
//         handlePageChange,
//         handleRowsPerPageChange,
//         handleSort,
//         state
//     };
// };


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
        <Card sx={{mt: 3}}>
            <CardContent>
                <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                value={itemsSearch.state.search[0]}/>
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
            </CardContent>
        </Card>
    )
}

export default StatesView