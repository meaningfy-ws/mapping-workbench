import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {ListTable} from "./list-table";
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';

import {useCallback, useEffect, useState} from "react";
import {useMounted} from "../../../hooks/use-mounted";


const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        currentFile: "",
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const filteredItems = items.filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if(pageSize < i && pageSize + state.rowsPerPage > i)
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
        filteredItems,
        state
    };
};





const ShaclValidationReport = ({ project_id, id, sid }) => {
    const [selectedValidationFile, setSelectedValidationFile] = useState("")
    const [validationReportFiles, setValidationReportFiles] = useState([])
    const [validationReport, setValidationReport] = useState([])

    useEffect(()=>{
        handleValidationReportsFilesGet(project_id, id, sid)
    },[])

    useEffect(()=>{
        selectedValidationFile && handleValidationReportsGet(project_id, id, sid, selectedValidationFile)
    },[selectedValidationFile])



     const handleValidationReportsGet = async (project_id, package_id, state_id, identifier = undefined) => {
        const data = { project_id, package_id, state_id, identifier }
        try {
            const result = await sectionApi.getShaclReports(data)
            setValidationReport(mapShaclResults(result));
        } catch (err) {
            console.error(err);
        }
    }

    const handleValidationReportsFilesGet = async (project_id, package_id, state_id) => {
        const data = { project_id, package_id, state_id }
        try {
            const result = await sectionApi.getShaclReportFiles(data)
            setValidationReportFiles(result);
            setSelectedValidationFile(result[0])
        } catch (err) {
            console.error(err);
        }
    }

    const mapShaclResults = (result) => result.map(e=>
        ({
            focusNode: e.focusNode.value,
            message: e.message.value,
            resultPath: e.resultPath.value,
            resultSeverity: e.resultSeverity.value,
            sourceConstraintComponent: e.sourceConstraintComponent.value,
            sourceShape: e.sourceShape.value
        })
    )

    const itemsSearch = useItemsSearch(validationReport);


    return(
        <>
            <Select
                onChange={(e) => {
                    itemsSearch.handleFiltersChange()
                    setSelectedValidationFile(e.target.value)
                }}
                value={selectedValidationFile}>
                {validationReportFiles?.map(file =>
                    <MenuItem key={file}
                              value={file}>
                        {file}
                    </MenuItem>)}
            </Select>
            <ListTable
                items={itemsSearch.filteredItems}
                count={validationReport?.length}
                onPageChange={itemsSearch.handlePageChange}
                onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                page={itemsSearch.state.page}
                rowsPerPage={itemsSearch.state.rowsPerPage}
                sectionApi={sectionApi}
            />
        </>
    )

}

export default ShaclValidationReport