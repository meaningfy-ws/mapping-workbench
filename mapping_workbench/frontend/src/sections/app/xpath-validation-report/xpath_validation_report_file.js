import {useEffect, useState} from "react";

import Typography from "@mui/material/Typography";

import {TableLoadWrapper} from "./utils";
import {ListTable} from "./list-table-file";
import CoverageReport from "./coverage_report";
// import ItemSearchInput from "../file-manager/item-search-input";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";
import useItemsSearch from "../../../hooks/use-items-search";

const XpathValidationReportTest = ({sid, suiteId, testId, mappingSuiteIdentifier}) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsTestGet(sid, suiteId, testId)
    }, [testId])

    const handleValidationReportsTestGet = (sid, suiteId, testId) => {
        setDataState({load: true, error: false})
        sectionApi.getXpathReportsTest(sid, suiteId, testId)
            .then(res => {
                setValidationReport(res.results)
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

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
                <ListTable
                    items={itemsSearch.pagedItems}
                    count={itemsSearch.count}
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    onFilter={itemsSearch.handleFiltersChange}
                    filters={itemsSearch.state.filters}
                    onSort={itemsSearch.handleSort}
                    sort={itemsSearch.state.sort}
                    sectionApi={sectionApi}
                />
            </TableLoadWrapper>
        </>
    )
}
export default XpathValidationReportTest