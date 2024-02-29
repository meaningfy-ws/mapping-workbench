import {useEffect, useState} from "react";
import {mappingPackageStatesApi as sectionApi} from "../../../api/mapping-packages/states";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import ItemSearchInput from "../file-manager/item-search-input";
import {ListTable} from "./list-table";
import Typography from "@mui/material/Typography";
import XpathRulesPaths from "./xpath_rules_paths";


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

    const sortedItems = state.sort.column ? filteredItems.sort((a,b) => {
        const sortColumn = state.sort.column
        return state.sort.direction === "asc" ?
             a[sortColumn]?.localeCompare(b[sortColumn]) :
             b[sortColumn]?.localeCompare(a[sortColumn])
    }) : filteredItems

    const pagedItems = sortedItems.filter((item, i) => {
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

const XpathValidationReportSuite = ({  sid, suiteId }) => {
    const [validationReport, setValidationReport] = useState([])
    const [dataLoad, setDataLoad] = useState(true)

    useEffect(()=>{
        handleValidationReportsSuiteGet(sid,suiteId)
    },[suiteId])

    const handleValidationReportsSuiteGet = async (sid, suiteId) => {
        try {
            setDataLoad(true)
            const result = await sectionApi.getXpathReportsSuite(sid, suiteId)
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
            <Typography m={2}
                        variant="h3">
                XPATH Assertions
            </Typography>
            <ItemSearchInput onFiltersChange={itemsSearch.handleSearchItems}/>
            {!validationReport?.length ?
                <Stack justifyContent="center"
                       direction="row">
                    <Alert severity="info">No Data !</Alert>
                </Stack> :
                <>
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
export default  XpathValidationReportSuite