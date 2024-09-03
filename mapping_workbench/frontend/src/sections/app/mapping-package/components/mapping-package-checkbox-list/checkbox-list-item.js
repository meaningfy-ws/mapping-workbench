import {useCallback, useEffect, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";


export const MappingPackageCheckboxListItem = (props) => {
    const {
        mappingPackage,
        mappingPackages,
        updateMappingPackages,
        ...other
    } = props;
    const isChecked = mappingPackages?.includes(mappingPackage.id);
    const [checked, setChecked] = useState(isChecked);

    const handleMappingPackageChange = useCallback((event) => {
        let _checked = event.target.checked;
        let _value = event.target.value;
        const index = mappingPackages.indexOf(_value);

        if (!_checked && index > -1) {
            mappingPackages.splice(index, 1)
        } else if (_checked) {
            mappingPackages.push(_value)
        }
        updateMappingPackages(mappingPackages);
        setChecked(_checked);
    }, [mappingPackages, updateMappingPackages]);

    useEffect(() => {
            setChecked(isChecked);
        },
        [isChecked]);

    return (
        <FormControlLabel
            sx={{
                width: '100%'
            }}
            control={
                <Switch
                    checked={checked}
                    onChange={handleMappingPackageChange}
                />
            }
            label={mappingPackage.title}
            value={mappingPackage.id}
        />
    )

}