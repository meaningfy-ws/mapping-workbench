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

const ShaclValidationReport = ({ items }) => {
    const [selectShaclValidationFile, setSelectShaclValidationFile] = useState(items[0].identifier)
    const shaclValidationFile = items.find(e => e.identifier === selectShaclValidationFile).results_dict.results.bindings

        const itemsSearch = useItemsSearch();
        console.log(itemsSearch)
        console.log(shaclValidationFile)
    // const itemsStore = useItemsStore(sessionApi.getSessionProject(), id, sid, itemsSearch.state);



    return(
        <>
            <Select
                onChange={(e) => setSelectShaclValidationFile(e.target.value)}
                // defaultValue={validationReports?.shacl[0].identifier}
                value={selectShaclValidationFile}>

                {items.map(e=>
                    <MenuItem key={e.identifier}
                              value={e.identifier}>
                        {e.identifier}
                    </MenuItem>)}
            </Select>
            <ListTable
                items={shaclValidationFile}
                count={shaclValidationFile.length}
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