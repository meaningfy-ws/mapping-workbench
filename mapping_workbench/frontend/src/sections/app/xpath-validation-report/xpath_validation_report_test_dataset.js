import {useEffect, useState} from "react";

import Typography from "@mui/material/Typography";

import {CoverageFilter, TableLoadWrapper} from "./utils";
import {ListTable} from "./list-table";
import CoverageReport from "./coverage_report";
// import ItemSearchInput from "../file-manager/item-search-input";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";
import useItemsSearch from "../../../hooks/use-items-search";

const XpathValidationReportSuite = ({sid, suiteId, files, mappingSuiteIdentifier, handleSelectFile}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsSuiteGet(sid, suiteId)
    }, [suiteId])

    const handleValidationReportsSuiteGet = (sid, suiteId) => {
        setDataState({load: true, error: false})
        sectionApi.getXpathReportsSuite(sid, suiteId)
            .then(res => {
                setValidationReport(res.results.map(e => ({...e, notice_count: e.test_data_xpaths.length})))
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    const handleCoverageFilterChange = e => {
        itemsSearch.handleFiltersChange({is_covered: e.target.value})
    }

    return (
        <>
            <Typography m={2}
                        variant="h4">
                Summary
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationReport}
                              lines={3}>
                <CoverageReport validationReport={validationReport}
                                mappingSuiteIdentifier={mappingSuiteIdentifier}/>
            </TableLoadWrapper>
            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationReport}>
                {/*<ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>*/}
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
        </>
    )
}
export default XpathValidationReportSuite