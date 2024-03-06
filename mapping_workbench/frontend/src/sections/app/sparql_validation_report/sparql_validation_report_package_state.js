import {useEffect, useState} from "react";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";

import ItemSearchInput from "../file-manager/item-search-input";
import {ListTable} from "./list-table";
import ResultSummaryTable from "./result-summary-table";
// import CoverageReport from "./coverage_report";
// import CoverageFiles from "./coverage_files";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
            is_covered: ""
        },
        sort: {
        },
        search: [],
        searchColumns:[],
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const {show, ...filters} = state.filters

    const searchItems = state.search.length ? items.filter(item => {
        let returnItem = null;
        state.searchColumns.forEach(column => {
            state.search.forEach(search => {
                if(item[column]?.toLowerCase()?.includes(search.toLowerCase()))
                    returnItem = item
            })
        })
        return returnItem
    }) : items

    const filteredItems = searchItems.filter((item) => {
        let returnItem = item;
        Object.entries(filters).forEach(filter=> {
            const [key, value] = filter
            if(value !== "" && value !== undefined && typeof item[key] === "boolean" && item[key] !== (value == "true"))
                returnItem = null
            if(value !== undefined && typeof item[key] === "string" && !item[key].toLowerCase().includes(value.toLowerCase))
                returnItem = null
        })
        return returnItem
    })

    const sortedItems = () => {
        const sortColumn = state.sort.column
        if(!sortColumn) {
            return filteredItems
        } else {
            return filteredItems.sort((a,b) => {
                if (typeof a[sortColumn] === "string")
                    return state.sort.direction === "asc" ?
                        a[sortColumn]?.localeCompare(b[sortColumn]) :
                        b[sortColumn]?.localeCompare(a[sortColumn])
                else
                    return state.sort.direction === "asc" ?
                        a[sortColumn] - b[sortColumn] :
                        b[sortColumn] - a[sortColumn]
                })
        }
    }

    const pagedItems = sortedItems().filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (filters) => {
        setState(prevState => ({...prevState, search: filters }))
    }

    const handleFiltersChange = (filters) => {
        setState((prevState) => ({
            ...prevState,
            filters,
            page: 0
        }));
    }

    const handlePageChange = (event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    }

    const handleSort = (column) => {
        setState(prevState=> ({ ...prevState, sort: {column,
                direction: prevState.sort.column === column && prevState.sort.direction === "asc" ? "desc" : "asc"}}))
    }
    const handleRowsPerPageChange = (event) => {
        setState((prevState) => ({
            ...prevState,
        }));
    }

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        handleSearchItems,
        pagedItems,
        count: filteredItems.length,
        state
    };
};

const SparqlValidationReport = ({ sid, files, mappingSuiteIdentifier }) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataLoad, setDataLoad] = useState(true)

    useEffect(()=>{
        handleValidationReportsGet(sid)
    },[])

    const handleValidationReportsGet = async (sid) => {
        try {
            const result = await sectionApi.getSparqlReports(sid)
            console.log(result)
            setValidationReport(mapSparqlResults(result.summary))
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoad(false)
        }
    }

    const mapSparqlResults = (result) => result.map(e=> {
        const queryAsArray = e.query.content.split("\n")
        const values = queryAsArray.slice(0,3)
        const resultArray = {}
        values.forEach(e => {
                const res = e.split(": ")
                resultArray[res[0].substring(1)] = res[1]
            }
        )
        resultArray["query"] = queryAsArray.slice(4, queryAsArray.length).join("\n")
        resultArray["test_suite"] = e.query.filename
        resultArray["result"] = e.result
        return resultArray;
    })

    const itemsSearch = useItemsSearch(validationReport);
    const handleCoverageFilterChange = e => {
        itemsSearch.handleFiltersChange({is_covered: e.target.value})
    }

    // const uniqueNotices =
    //     [...new Set(validationReport.map(xpaths => xpaths.test_data_xpaths.map(notice => notice.test_data_id)).flat())]

    return dataLoad ?
        <>
            <Skeleton width="20%"
                      height={80} />
            {
                new Array(5).fill("").map((e, i) =>
                <Skeleton key={i}
                          height={50}/>)
            }
        </> :
        <>
            {/*<CoverageReport validationReport={validationReport}*/}
            {/*                mappingSuiteIdentifier={mappingSuiteIdentifier}/>*/}
            <ResultSummaryTable items={validationReport}/>
            <Typography m={2}
                        variant="h4">
                Assertions
            </Typography>
            <Box sx={{p: 2.5, display: 'flex'}}
                 direction="row">
                <Stack
                    component={RadioGroup}
                    name="terms_validity"
                    spacing={3}
                    onChange={handleCoverageFilterChange}
                >
                    <Paper
                        key="2"
                        sx={{
                            alignItems: 'flex-start',
                            display: 'flex',
                            p: 2
                        }}
                        variant="outlined"
                    >
                        <Box sx={{mr: 2, mt: 1}}>
                            <b>Filter Coverage:</b>
                        </Box>
                        <FormControlLabel
                            control={<Radio/>}
                            key="terms_validity_all"
                            checked={itemsSearch.state.filters.is_covered === ""}
                            label={(
                                <Box sx={{ml: 0, mr: 1}}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        All
                                    </Typography>
                                </Box>
                            )}
                            value=""
                        />
                        <FormControlLabel
                            control={<Radio/>}
                            key="terms_validity_valid"
                            checked={itemsSearch.state.filters.is_covered === "true"}
                            label={(
                                <Box sx={{ml: 0, mr: 1}}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        Covered
                                    </Typography>
                                </Box>
                            )}
                            value="true"
                        />
                        <FormControlLabel
                            control={<Radio/>}
                            key="terms_validity_invalid"
                            checked={itemsSearch.state.filters.is_covered === "false"}
                            label={(
                                <Box sx={{ml: 0, mr: 1}}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        Not Covered
                                    </Typography>
                                </Box>
                            )}
                            value="false"
                        />
                    </Paper>
                </Stack>
            </Box>
            {!validationReport?.length ?
                <Stack justifyContent="center"
                       direction="row">
                    <Alert severity="info">No Data !</Alert>
                </Stack> :
                <>
                    <ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>
                    <ListTable
                            items={itemsSearch.pagedItems}
                            count={itemsSearch.count}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            onSort={itemsSearch.handleSort}
                            sort={itemsSearch.state.sort}
                            sectionApi={sectionApi}
                    />
                </>
            }
        </>
}
export default  SparqlValidationReport