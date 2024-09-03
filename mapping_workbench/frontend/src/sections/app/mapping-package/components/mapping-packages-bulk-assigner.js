import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {MappingPackageCheckboxList} from "./mapping-package-checkbox-list";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";
import {mappingPackagesApi} from "/src/api/mapping-packages";
import SvgIcon from "@mui/material/SvgIcon";
import {Assignment as AssignmentIcon} from "@mui/icons-material";
import {useDialog} from "../../../../hooks/use-dialog";
import {toastError, toastLoad, toastSuccess} from "../../../../components/app-toast";
import {paths} from "../../../../paths";

export const MappingPackagesBulkAssigner = (props) => {
    const {
        idsToAssignTo,
        sectionApi,
        disabled,
        onMappingPackagesAssign = () => {},
        toMappingPackages = [],
        initProjectMappingPackages = null
    } = props;

    const mappingPackagesDialog = useDialog()

    const [projectMappingPackages, setProjectMappingPackages] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        (async () => {
            if (initProjectMappingPackages === null) {
                setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
            } else {
                setProjectMappingPackages(initProjectMappingPackages)
            }
        })()
    }, [initProjectMappingPackages])

    const handleMappingPackagesAssign = async () => {
        setIsRunning(true);
        const toastId = toastLoad(`Assigning MappingPackages ... `)
        sectionApi.assignMappingPackages(idsToAssignTo, toMappingPackages).then((res) => {
            toastSuccess(sectionApi.SECTION_TITLE + ' updated', toastId);
        }).catch(err => {
            toastError(err, toastId);
        }).finally(() => {
            setIsRunning(false)
            mappingPackagesDialog.handleClose();
            onMappingPackagesAssign()
        });
    };

    return (<>
        <Box
            align="left"
        >
            <Button
                type='link'
                onClick={mappingPackagesDialog.handleOpen}
                disabled={disabled || isRunning}
                startIcon={(
                    <SvgIcon>
                        <AssignmentIcon/>
                    </SvgIcon>
                )}
                size="small"
                variant="text"
                id="assign-mapping-packages_button"
            >
                To Packages
            </Button>
        </Box>
        <Dialog
            onClose={mappingPackagesDialog.handleClose}
            open={mappingPackagesDialog.open}
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
                    Mapping Packages
                </Typography>
                <Box
                    spacing={3}>
                    <MappingPackageCheckboxList
                        mappingPackages={toMappingPackages}
                        initProjectMappingPackages={projectMappingPackages}
                    />
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleMappingPackagesAssign}
                >
                    Assign
                </Button>
            </Stack>
        </Dialog>
    </>)
}