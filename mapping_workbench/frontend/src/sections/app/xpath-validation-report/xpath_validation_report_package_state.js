import {useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import exportPackage from '../../../utils/export-mapping-package';

import {ListTable} from "./list-table";
import ResultSummaryCoverage from './result-summary-coverage';
import {CoverageFilter, TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";

const XpathValidationReport = ({validationReport, handleSelectFile, mappingSuiteIdentifier, handleExport}) => {
    const [dataState, setDataState] = useState({load: false, error: false})

    const itemsSearch = useItemsSearch(validationReport, sectionApi)

    const handleCoverageFilterChange = e => itemsSearch.handleFiltersChange({is_covered: e.target.value})

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage identifier={mappingSuiteIdentifier}
                                       handleExport={handleExport}
                                       validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Paper>
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
                </Paper>
            </Grid>
        </>
    )
}
export default XpathValidationReport