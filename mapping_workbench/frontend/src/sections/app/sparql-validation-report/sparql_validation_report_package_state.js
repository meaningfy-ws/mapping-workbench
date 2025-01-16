import {useState} from "react";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import {ListTable} from "./list-table";
import {TableLoadWrapper} from "./utils";
import useItemsSearch from "src/hooks/use-items-search";
import {ResultSummaryCoverage} from './result-summary-coverage';
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";


const SparqlValidationReport = ({handleSelectFile, validationReport}) => {
    const [dataState, setDataState] = useState({load: false, error: false})
    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    return (
        <>
            <Grid xs={12}
                  md={8}>
                <ResultSummaryCoverage validationReport={validationReport}/>
            </Grid>
            <Grid xs={12}>
                <Paper>
                    <TableLoadWrapper dataState={dataState}
                                      lines={6}
                                      data={validationReport}>
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
                            sectionApi={sectionApi}
                            handleSelectFile={handleSelectFile}
                        />
                    </TableLoadWrapper>
                </Paper>
            </Grid>
        </>)
}

export default SparqlValidationReport