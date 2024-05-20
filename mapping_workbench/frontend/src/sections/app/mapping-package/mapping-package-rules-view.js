import {useEffect, useState} from "react";

import Card from "@mui/material/Card";

import {conceptualMappingRulesApi} from "../../../api/conceptual-mapping-rules";
import {ListSearch as MappingRulesListSearch} from "../conceptual-mapping-rule/list-search";
import {ListTable as MappingRulesListTable} from "../conceptual-mapping-rule/list-table";


const useMappingRulesSearch = () => {
    const [state, setState] = useState({
        filters: {
            q: undefined,
            terms_validity: undefined,
        },
        page: conceptualMappingRulesApi.DEFAULT_PAGE,
        rowsPerPage: conceptualMappingRulesApi.DEFAULT_ROWS_PER_PAGE,
        detailedView: true
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters,
            //page: 0
        }));
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    }

    const handleRowsPerPageChange = event => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    const handleDetailedViewChange = (event, detailedView) => {
        setState(prevState => ({
            ...prevState,
            detailedView
        }));
    }

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleDetailedViewChange,
        state
    };
};

const useMappingRulesStore = (searchState, mappingPackage) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
    });

    useEffect(() => {
        handleItemsGet();
    }, [searchState]);
    const handleItemsGet = () => {
            const request = searchState;
            request['filters']['mapping_packages'] = [mappingPackage];
            conceptualMappingRulesApi.getItems(request)
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

    const {id} = props

    const mappingRulesSearch = useMappingRulesSearch();
    const mappingRulesStore = useMappingRulesStore(mappingRulesSearch.state, id);

    const handlePackagesUpdate = (event, value) => {
        mappingRulesStore.handleItemsGet();
    }

    return(
            <Card>
                <MappingRulesListSearch
                    onFiltersChange={mappingRulesSearch.handleFiltersChange}
                    onDetailedViewChange={mappingRulesSearch.handleDetailedViewChange}
                    detailedView={mappingRulesSearch.state.detailedView}
                />
                <MappingRulesListTable
                    onPageChange={mappingRulesSearch.handlePageChange}
                    onRowsPerPageChange={mappingRulesSearch.handleRowsPerPageChange}
                    page={mappingRulesSearch.state.page}
                    items={mappingRulesStore.items}
                    count={mappingRulesStore.itemsCount}
                    rowsPerPage={mappingRulesSearch.state.rowsPerPage}
                    sectionApi={conceptualMappingRulesApi}
                    onPackagesUpdate={handlePackagesUpdate}
                    detailedView={mappingRulesSearch.state.detailedView}
                />
            </Card>
    )
}

export default  MappingPackageRulesView