import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";
import {mappingPackagesApi} from "../../../api/mapping-packages";

export const MappingPackagesSelector = (props) => {
    const {
        onClose,
        open = false,
        idsToAssignTo,
        sectionApi,
        initProjectMappingPackages
    } = props;

    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages ?? []);

    useEffect(() => {
        (async () => {
            if (initProjectMappingPackages === null) {
                setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
            }
        })()
    }, [mappingPackagesApi])

    return (<Dialog
        onClose={onClose}
        open={open}
        fullWidth
        maxWidth="sm"
    >
        <Stack
            spacing={3}
            sx={{
                px: 3, py: 2
            }}
        >
            <Typography variant="h6">
                Mapping Rule Packages
            </Typography>
            <Box
                spacing={3}>
                <MappingPackageCheckboxList
                    initProjectMappingPackages={projectMappingPackages}/>
            </Box>
            <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => {}}
            >
                Update
            </Button>
        </Stack>
    </Dialog>)
}