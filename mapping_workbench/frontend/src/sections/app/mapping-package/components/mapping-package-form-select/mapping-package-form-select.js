import {useCallback, useEffect, useState} from "react";
import {mappingPackagesApi} from "src/api/mapping-packages";
import {useMounted} from "src/hooks/use-mounted";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const useMappingPackagesStore = () => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: []
    });

    const handleMappingPackagesGet = useCallback(async () => {
        try {
            const mappingPackages = await mappingPackagesApi.getProjectPackages();
            if (isMounted()) {
                setState({
                    items: mappingPackages,
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

export const MappingPackageFormSelect = (props) => {
    const {formik, isRequired, withDefaultPackage = false, ...other} = props;
    const mappingPackagesStore = useMappingPackagesStore();

    const handleMappingPackageChange = async (event) => {
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
            >
                <MenuItem key="" value="">&nbsp;</MenuItem>
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
