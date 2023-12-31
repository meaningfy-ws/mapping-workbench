import {useCallback, useEffect, useState} from "react";
import {mappingPackagesApi} from "src/api/mapping-packages";
import {useMounted} from "src/hooks/use-mounted";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {useRouter} from "src/hooks/use-router";

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
    const {formik, ...other} = props;
    const mappingPackagesStore = useMappingPackagesStore();

    const handleMappingPackageChange = useCallback(async (event) => {
        let value = event.target.value;
        formik.setFieldValue('mapping_package_id', value);
    }, [formik])

    return (
        <>
            <TextField
                error={!!(formik.touched.mapping_package_id && formik.errors.mapping_package_id)}
                fullWidth
                label="Mapping Package"
                name="mapping_package_id"
                onBlur={formik.handleBlur}
                onChange={handleMappingPackageChange}
                select
                value={formik.values.mapping_package_id}
                required={formik.values.mapping_package_id.required}
            >
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
