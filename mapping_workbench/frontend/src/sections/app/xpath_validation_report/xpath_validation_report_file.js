import {useEffect, useState} from "react";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import ItemSearchInput from "../file-manager/item-search-input";
import {ListTable} from "./list-table";
import Typography from "@mui/material/Typography";
import XpathRulesPaths from "./xpath_rules_paths";
import CoverageReport from "./coverage_report";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
        },
        sort: {
        },
        search: [],
        searchColumns:["eforms_sdk_element_id","test_data_xpath"],
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

        Object.entries(filters).forEach(e=> {
            const [key, value] = e
            if(value !== undefined && typeof item[key] === "boolean" && item[key]?.toString() != value)
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
            rowsPerPage: parseInt(event.target.value, 10)
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

const XpathValidationReportTest= ({  sid, suiteId, testId, mappingSuiteIdentifier }) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataLoad, setDataLoad] = useState(true)

    useEffect(()=>{
        handleValidationReportsTestGet(sid, suiteId, testId)
    },[testId])

    const handleValidationReportsTestGet = async (sid, suiteId, testId) => {
        try {
            const result = await sectionApi.getXpathReportsTest(sid, suiteId, testId)
            setValidationReport(result)
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoad(false)
        }
    }

    const itemsSearch = useItemsSearch(validationReport);

    const { coveredReports, notCoveredReports } = validationReport.reduce((acc, report) => {
        acc[report.is_covered ? "coveredReports" : "notCoveredReports"].push({ eforms_sdk_element_xpath: report.eforms_sdk_element_xpath })
        return acc
    }, {coveredReports:[], notCoveredReports:[]})

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
            {!validationReport?.length ?
                <Stack justifyContent="center"
                       direction="row">
                    <Alert severity="info">No Data !</Alert>
                </Stack> :
                <>
                    <CoverageReport validationReport={validationReport}
                        mappingSuiteIdentifier={mappingSuiteIdentifier}/>
                    <Typography m={2}
                                variant="h4">
                        Assertions
                    </Typography>
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
                    <XpathRulesPaths title={`XPATHs covered in the "Rules" of Conceptual Mapping`}
                                             items={coveredReports}/>
                    <XpathRulesPaths title="XPATHs not covered by Conceptual Mapping"
                                         items={notCoveredReports}/>
                </>}
            </>
}
export default  XpathValidationReportTest