import {useEffect, useState} from "react";

import Typography from "@mui/material/Typography";

import {TableLoadWrapper} from "./utils";
import {ResultTable} from "./result-table";
import {ListTableFile} from "./list-table-file";
import {mappingPackageStatesApi as sectionApi} from "src/api/mapping-packages/states";
import useItemsSearch from "../../../hooks/use-items-search";


const ShaclFileReport = ({sid, suiteId, testId}) => {
    const [validationReport, setValidationReport] = useState([])
    const [validationResult, setValidationResult] = useState([])
    const [dataState, setDataState] = useState({load: true, error: false})

    useEffect(() => {
        handleValidationReportsGet(sid, suiteId, testId)
    }, [])

    const handleValidationReportsGet = (sid, suiteId, testId) => {
        setDataState({load: true, error: false})
        sectionApi.getSparqlReportsFile(sid, suiteId, testId)
            .then(res => {
                setValidationReport(mapShaclFileResults(res.results?.[0]?.results?.[0]?.results) ?? [])
                setValidationResult(mapShaclFileStates(res.results?.[0]) ?? []);
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    const mapShaclFileStates = (states) => {
        return states?.results.map(e => ({
            conforms: e.conforms, error: e.error, title: states.shacl_suite.shacl_suite_id
        }))
    }

    const mapShaclFileResults = (result) => result?.map(e => ({...e.binding}))

    const itemsSearch = useItemsSearch(validationReport, sectionApi);

    return (
        <>
            <Typography m={2}
                        variant="h4">
                Results
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationResult}
                              lines={2}>
                <ResultTable items={validationResult}
                             sectionApi={sectionApi}/>
            </TableLoadWrapper>
            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <TableLoadWrapper dataState={dataState}
                              data={validationReport}>
                {/*<ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>*/}
                <ListTableFile
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
                />
            </TableLoadWrapper>
        </>
    )
}
export default ShaclFileReport