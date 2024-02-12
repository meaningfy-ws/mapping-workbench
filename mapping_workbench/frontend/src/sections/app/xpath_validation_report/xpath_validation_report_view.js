import {useEffect, useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import FilterIcon from '@mui/icons-material/FilterList'
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';
import {ListTable} from "./list-table";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
        },
        currentFile: "",
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });


    const {show, ...filters} = state.filters
    const filteredItems = items.filter((item) => {
        let returnItem = item;

        Object.entries(filters).forEach(e=> {
            const [key, value] = e
            if(value !== undefined && item[key].toString() != value)
                returnItem = null
        })
        return returnItem
    })

    const pagedItems = filteredItems.filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

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
        pagedItems,
        filteredItems,
        state
    };
};

const XpathValidationReport = ({ project_id, id, sid, files }) => {
    const [selectedValidationFile, setSelectedValidationFile] = useState(files[0])
    const [validationReport, setValidationReport] = useState([])
    const [dataLoad, setDataLoad] = useState(true)
    const [filters, setFilters] = useState({})

    useEffect(()=>{
        selectedValidationFile && handleValidationReportsGet(project_id, id, sid, selectedValidationFile)
    },[selectedValidationFile])

    const handleValidationReportsGet = async (project_id, package_id, state_id, identifier) => {
        const data = { project_id, package_id, state_id, identifier }
        try {
            const result = await sectionApi.getXpathReports(data)
            setValidationReport(result)
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoad(false)
        }
    }

    const handleFilterChange = (value) => {
        const isCovered = {is_covered: value === "any" ? undefined : value}
        itemsSearch.handleFiltersChange({...itemsSearch.state.filters, ...isCovered})
    }

    const itemsSearch = useItemsSearch(validationReport);

    const filterContains = ["true","false","any"]

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
        !files?.length ?
            <Stack justifyContent="center"
                   direction="row">
                <Alert severity="info">No Data !</Alert>
            </Stack> :
            <>
                <Stack direction="row"
                       justifyContent="space-between">
                    <Select
                        onChange={(e) => {
                            itemsSearch.handlePageChange(e,0)
                            setSelectedValidationFile(e.target.value)
                        }}
                        value={selectedValidationFile}>
                        {files?.map(file =>
                            <MenuItem key={file}
                                      value={file}>
                                {file}
                            </MenuItem>)}
                    </Select>
                    <Tooltip title="Filter"
                             arrow>
                        <IconButton color={["true","false"].includes(itemsSearch.state.filters?.is_covered) ? "primary" : "inherit"}
                                    onClick={(el)=> setFilters(e=> ({...e, show: el.target}))}>
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                    <Popover
                      id={id}
                      open={!!filters.show}
                      anchorEl={filters.show}
                      onClose={()=>setFilters(e=> ({...e, show: null}))}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                        <Stack direction="row"
                               alignItems="center"
                               spacing={1}
                               style={{padding: '10px'}}>
                            <Typography variant="subtitle2">Is covered:</Typography>
                            <Select onChange={(e) => handleFilterChange(e.target.value)}
                                value={itemsSearch.state.filters?.is_covered ?? "any"}>
                                {filterContains.map(e =>
                                    <MenuItem key={e}
                                              value={e}>
                                        {e}
                                    </MenuItem>)}
                            </Select>
                        </Stack>
                    </Popover>
                </Stack>
                <ListTable
                    items={itemsSearch.pagedItems}
                    count={itemsSearch.filteredItems.length}
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    sectionApi={sectionApi}
                />
            </>
}

export default XpathValidationReport