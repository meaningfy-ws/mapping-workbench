import {useEffect, useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import {mappingPackagesApi} from "src/api/mapping-packages";

const useMappingPackagesStore = () => {
    const [state, setState] = useState({items: []});

    const handleMappingPackagesGet = () => {
        mappingPackagesApi.getProjectPackages()
            .then(res => setState({items: res}))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        handleMappingPackagesGet();
    }, []);

    return {
        ...state
    };
};

export const MappingPackageFormSelect = (props) => {
    const {formik, isRequired, disabled, withDefaultPackage = false, ...other} = props;
    const mappingPackagesStore = useMappingPackagesStore();

    const handleMappingPackageChange = event => {
        const value = event.target.value;
        formik.setFieldValue('mapping_package_id', value);
    }

    useEffect(() => {
        if (withDefaultPackage) {
            const defaultPackage = mappingPackagesStore.items.find(pkg => pkg.identifier === 'default');
            if (defaultPackage) {
                formik.setFieldValue('mapping_package_id', defaultPackage.id)
            }
        }
    }, [mappingPackagesStore.items]);

    return (
        <>
            <TextField
                error={!!(formik.touched.mapping_package_id && formik.errors.mapping_package_id)}
                fullWidth
                helperText={formik.touched.mapping_package_id && formik.errors.mapping_package_id}
                label="Mapping Package"
                name="mapping_package_id"
                onBlur={formik.handleBlur}
                onChange={handleMappingPackageChange}
                select
                value={formik.values.mapping_package_id}
                required={isRequired}
                disabled={disabled}
            >
                <MenuItem key=""
                          value="">
                    &nbsp;
                </MenuItem>
                {mappingPackagesStore.items.map((mapping_package) => (
                    <MenuItem
                        key={mapping_package.id}
                        value={mapping_package.id}
                    >
                        {mapping_package.title}
                    </MenuItem>
                ))}
            </TextField>
        </>
    );
};
