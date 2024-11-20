import {useEffect, useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";

import {MappingPackageCheckboxListItem} from "./checkbox-list-item";
import {mappingPackagesApi} from "src/api/mapping-packages";


const useMappingPackagesStore = (initProjectMappingPackages = null) => {
    const [state, setState] = useState({items: initProjectMappingPackages ?? []});
    const handleMappingPackagesGet = () => {
        if (initProjectMappingPackages === null) {
            mappingPackagesApi.getProjectPackages()
                .then(res => setState({
                    items: res
                }))
                .catch(err => console.error(err))
        }
    }

    useEffect(() => {
        handleMappingPackagesGet();
    }, []);

    return {
        ...state
    };
};

export const MappingPackageCheckboxList = (props) => {
    const {
        mappingPackages = [],
        handleUpdate = () => {},
        initProjectMappingPackages = null,
        withDefaultPackage = false,
        ...other
    } = props;

    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    const allChecked = projectMappingPackages.length === mappingPackages.length

    const mappingPackagesStore = useMappingPackagesStore(initProjectMappingPackages)

    useEffect(() => {
        setProjectMappingPackages(mappingPackagesStore.items);
    }, [mappingPackagesStore]);


    const handleMappingPackageChangeAll = (event) => {
        handleUpdate(event.target.checked ? projectMappingPackages.map(pack => pack.id) : [])
    }

    const handleMappingPackageChange = (id, checked) => {
        handleUpdate(checkedPacks => checked ? [...checkedPacks, id] : [...checkedPacks.filter(pack => pack !== id)])
    };

    return (
        <>
            <MenuList>
                <MenuItem key={0}>
                    <FormControlLabel
                        sx={{width: '100%'}}
                        control={
                            <Checkbox
                                checked={allChecked}
                                indeterminate={!!mappingPackages.length && !allChecked}
                                onChange={handleMappingPackageChangeAll}
                            />
                        }
                        label={<b>All Packages</b>}
                        value=""
                    />
                </MenuItem>
                {projectMappingPackages.map(project_mapping_package =>
                    <MenuItem key={project_mapping_package.id}>
                        <MappingPackageCheckboxListItem
                            xs={12}
                            mappingPackage={project_mapping_package}
                            mappingPackages={mappingPackages}
                            handleMappingPackageChange={handleMappingPackageChange}
                        />
                    </MenuItem>)
                }
            </MenuList>

        </>
    )
}