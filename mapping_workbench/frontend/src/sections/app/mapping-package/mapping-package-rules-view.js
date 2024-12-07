import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import {useEffect, useState} from "react";

import Card from "@mui/material/Card";

import {
    conceptualMappingRulesApi as sectionApi,
    conceptualMappingRulesApi
} from "../../../api/conceptual-mapping-rules";
import useItemsSearch from '../../../hooks/use-items-search';
import {Filter} from '../../components/filter';
import {TableSearchBar} from '../../components/table-search-bar';
import {ListSearch as MappingRulesListSearch} from "../conceptual-mapping-rule/list-search";
import {ListTable as MappingRulesListTable} from "../conceptual-mapping-rule/list-table";


export const useItemsStore = (sectionApi) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems()
            .then(res => setState({items: res.items, itemsCount: res.count}))
            .catch(err => console.error(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        handleItemsGet,
        ...state
    };
};

const useMappingRulesStore = (mappingPackage) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
    });

    useEffect(() => {
        handleItemsGet();
    }, []);

    const handleItemsGet = () => {
        conceptualMappingRulesApi.getItems({filters: {mapping_packages: [mappingPackage]}})
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count
                }))
            .catch(err => console.error(err))
    }


    return {
        handleItemsGet, ...state
    };
};
const MappingPackageRulesView = (props) => {
    const [detailedView, setDetailedView] = useState(true)
    const {id} = props

    const mappingRulesStore = useMappingRulesStore(id);
    // const mappingRulesSearch = useMappingRulesSearch(mappingRulesStore);

    const handlePackagesUpdate = (event, value) => {
        mappingRulesStore.handleItemsGet();
    }

    const mappingRulesSearch = useItemsSearch(mappingRulesStore.items, sectionApi,
        ['source_structural_element_sdk_element_id', 'target_class_path', 'target_property_path'],
        {terms: ''});

    const filterValues = [{label: 'All', value: ''},
        {label: 'Valid', value: 'valid'},
        {label: 'Invalid', value: 'invalid'}]


    return (
        <Card>
            <TableSearchBar onChange={e => mappingRulesSearch.handleSearchItems([e])}
                            value={mappingRulesSearch.state.search[0]}/>
            <Divider/>
            <Stack direction='row'
                   padding={3}>
                <FormControlLabel control={<Switch checked={detailedView}
                                                   onChange={e => setDetailedView(e.target.checked)}/>}
                                  label='Detailed View'/>
                <Paper variant='outlined'>
                    <Filter title={'Terms:'}
                            values={filterValues}
                            value={mappingRulesSearch.state.filters.terms}
                            onValueChange={e => mappingRulesSearch.handleFiltersChange({terms: e})}/>
                </Paper>
            </Stack>
            <Divider/>
            <MappingRulesListTable
                onPageChange={mappingRulesSearch.handlePageChange}
                onRowsPerPageChange={mappingRulesSearch.handleRowsPerPageChange}
                page={mappingRulesSearch.state.page}
                items={mappingRulesSearch.pagedItems}
                count={mappingRulesSearch.count}
                sort={mappingRulesSearch.state.sort}
                onSort={mappingRulesSearch.handleSort}
                rowsPerPage={mappingRulesSearch.state.rowsPerPage}
                sectionApi={conceptualMappingRulesApi}
                onPackagesUpdate={handlePackagesUpdate}
                detailedView={detailedView}
            />
        </Card>
    )
}

export default MappingPackageRulesView