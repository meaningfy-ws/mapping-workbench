import {useState} from "react";

import Card from '@mui/material/Card';

import {ListTable} from "./list-table";
import {CoverageFilter, TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const XpathValidationReport = ({validationReport, handleSelectFile}) => {
    const [dataState, setDataState] = useState({load: false, error: false})

    const itemsSearch = useItemsSearch(validationReport, sectionApi)

    const handleCoverageFilterChange = e => itemsSearch.handleFiltersChange({is_covered: e.target.value})


    return (
        <Card>
            <TableLoadWrapper data={validationReport}
                              dataState={dataState}>
                <CoverageFilter onChange={handleCoverageFilterChange}
                                filterState={itemsSearch.state.filters.is_covered}/>
                <ListTable
                    items={itemsSearch.pagedItems}
                    count={itemsSearch.count}
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    onSort={itemsSearch.handleSort}
                    sort={itemsSearch.state.sort}
                    onFilter={itemsSearch.handleFiltersChange}
                    filters={itemsSearch.state.filters}
                    handleSelectFile={handleSelectFile}
                    sectionApi={sectionApi}
                />
            </TableLoadWrapper>
        </Card>
    )
}
export default XpathValidationReport