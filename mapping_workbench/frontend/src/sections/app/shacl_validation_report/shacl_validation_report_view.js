import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {ListTable} from "./list-table";
import {mappingPackageStatesApi as sectionApi} from 'src/api/mapping-packages/states';

import {useCallback, useEffect, useState} from "react";
import {useMounted} from "../../../hooks/use-mounted";


const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

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
        state
    };
};




const useItemsStore = (project_id, id, sid, searchState) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const response = await sectionApi.getValidationReports({
                project_id,
                id,
                sid,
                searchState
            });
            console.log(sectionApi.getValidationReports)
            if (isMounted()) {
                setState({
                    items: response.shacl,
                    itemsCount: response.shacl.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);


    useEffect(() => {
            handleItemsGet()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

const ShaclValidationReport = ({ project_id, id, sid }) => {
    const [selectShaclValidationFile, setSelectShaclValidationFile] = useState("")
    const [validationReport, setValidationReport] = useState()

    useEffect(()=>{
        handleValidationResultsGet(project_id,id,sid,selectShaclValidationFile)
    },[selectShaclValidationFile])

     const handleValidationResultsGet = async (project_id, package_id, state_id, identifier = undefined) => {
        const data = { project_id, package_id, state_id, identifier }
        try {
            const result = await sectionApi.getShaclReports(data)
            setValidationReport({...result, items: mapShaclResults(result)});
            if(!selectShaclValidationFile)
            {
                setSelectShaclValidationFile(result.files[0])

            }
        } catch (err) {
            console.error(err);
        }
    }

    const mapShaclResults = (result) => result?.items.map(e=>
        ({
            focusNode: e.focusNode.value,
            message: e.message.value,
            resultPath: e.resultPath.value,
            resultSeverity: e.resultSeverity.value,
            sourceConstraintComponent: e.sourceConstraintComponent.value,
            sourceShape: e.sourceShape.value
        })
    )

    const itemsSearch = useItemsSearch();

    return(
        <>
            <Select
                onChange={(e) => setSelectShaclValidationFile(e.target.value)}
                value={selectShaclValidationFile}>
                {validationReport?.files?.map(file =>
                    <MenuItem key={file}
                              value={file}>
                        {file}
                    </MenuItem>)}
            </Select>
            <ListTable
                items={validationReport?.items}
                count={validationReport?.items?.length}
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