import {useCallback, useEffect, useState} from "react";
import {mappingPackagesApi} from "../../../../../api/mapping-packages";
import MenuItem from "@mui/material/MenuItem";
import {MappingPackageCheckboxListItem} from "./checkbox-list-item";
import MenuList from "@mui/material/MenuList";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {setState} from "@aws-amplify/auth/lib/OAuth/oauthStorage";


export const MappingPackageCheckboxList = (props) => {
    const {mappingPackages = [], initProjectMappingPackages = [],...other} = props;

    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages);

    useEffect(() => {
        (async () => {
            if (initProjectMappingPackages.length === 0) {
                setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
            }
        })()
    }, [mappingPackagesApi])


    const [checked, setChecked] = useState(false);

    const handleAllMappingPackagesChange = useCallback((event) => {
        let _checked = event.target.checked;

        mappingPackages.length = 0;
        if (_checked)  {
            for (let _value of projectMappingPackages.map(x => x.id)) {
                mappingPackages.push(_value);
            }
        }

        setChecked(_checked);
    }, [projectMappingPackages]);

    useEffect(() => {
            setChecked((projectMappingPackages.filter(x => !mappingPackages.includes(x.id))).length === 0);
        },
        [projectMappingPackages, mappingPackages]);

    return (
        <>
            <MenuList>
                <MenuItem>
                    <FormControlLabel
                        sx={{
                            width: '100%'
                        }}
                        control={
                            <Switch
                                checked={checked}
                                onChange={handleAllMappingPackagesChange}
                            />
                        }
                        label="All Packages"
                        value=""
                    />
                </MenuItem>
            </MenuList>
            {projectMappingPackages.map((project_mapping_package) => {
                return (
                    <MenuList>
                        <MenuItem>
                            <MappingPackageCheckboxListItem
                                xs={12}
                                mappingPackage={project_mapping_package}
                                mappingPackages={mappingPackages}
                            />
                        </MenuItem>
                    </MenuList>
                )
            })}
        </>
    )
}