import {useCallback, useEffect, useState} from "react";
import {mappingPackagesApi} from "../../../../../api/mapping-packages";
import MenuItem from "@mui/material/MenuItem";
import {MappingPackageCheckboxListItem} from "./checkbox-list-item";
import MenuList from "@mui/material/MenuList";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useMounted} from "../../../../../hooks/use-mounted";


const useMappingPackagesStore = (initProjectMappingPackages = []) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: initProjectMappingPackages
    });

    const handleMappingPackagesGet = useCallback(async () => {
        try {
            let mappingPackages = initProjectMappingPackages;
            if (mappingPackages.length === 0) {
                mappingPackages = (await mappingPackagesApi.getProjectPackages());
            }
            if (isMounted()) {
                setState({
                    items: mappingPackages
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted]);

    useEffect(() => {
        handleMappingPackagesGet();
    }, []);

    return {
        ...state
    };
};

export const MappingPackageCheckboxList = (props) => {
    const {mappingPackages = [], initProjectMappingPackages = [], ...other} = props;

    const [allChecked, setAllChecked] = useState(false);
    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    const mappingPackagesStore = useMappingPackagesStore(initProjectMappingPackages)
    useEffect(() => {
        setProjectMappingPackages(mappingPackagesStore.items);
    }, [mappingPackagesStore]);

    const handleAllMappingPackagesChange = useCallback((event) => {
        let _checked = event.target.checked;

        mappingPackages.length = 0;
        if (_checked) {
            for (let _value of projectMappingPackages.map(x => x.id)) {
                mappingPackages.push(_value);
            }
        }

        setAllCheckedCallback(mappingPackages);
    }, [projectMappingPackages]);

    const setAllCheckedCallback = useCallback((values) => {
        setAllChecked(
            values.length > 0 && (projectMappingPackages.filter(x => !values.includes(x.id))).length === 0
        );
    }, [projectMappingPackages]);

    useEffect(() => {
        setAllCheckedCallback(mappingPackages);
    }, [projectMappingPackages]);

    const updateMappingPackages = useCallback((values) => {
        setAllCheckedCallback(values);
    }, [projectMappingPackages]);

    return (
        <>
            <MenuList>
                <MenuItem key={0}>
                    <FormControlLabel
                        sx={{
                            width: '100%'
                        }}
                        control={
                            <Switch
                                checked={allChecked}
                                onChange={handleAllMappingPackagesChange}
                            />
                        }
                        label="All Packages"
                        value=""
                    />
                </MenuItem>
                {projectMappingPackages.map((project_mapping_package) => {
                    return (
                        <MenuItem key={project_mapping_package.id}>
                            <MappingPackageCheckboxListItem
                                xs={12}
                                mappingPackage={project_mapping_package}
                                mappingPackages={mappingPackages}
                                updateMappingPackages={updateMappingPackages}
                            />
                        </MenuItem>
                    )
                })}
            </MenuList>

        </>
    )
}