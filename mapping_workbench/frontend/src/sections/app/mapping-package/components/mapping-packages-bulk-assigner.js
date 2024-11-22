import {useState} from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import {useDialog} from "src/hooks/use-dialog";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {MappingPackageCheckboxList} from './mapping-package-real-checkbox-list';

export const MappingPackagesBulkAssigner = (props) => {
    const {
        sectionApi,
        disabled,
        idsToAssignTo,
        initProjectMappingPackages = null,
        onMappingPackagesAssign = () => {}
    } = props;

    const mappingPackagesDialog = useDialog()

    const [isRunning, setIsRunning] = useState(false);
    const [selectedPackagesIds, setSelectedPackagesIds] = useState(idsToAssignTo)

    const handleMappingPackagesAssign = () => {
        setIsRunning(true);
        const toastId = toastLoad(`Assigning MappingPackages ... `)
        sectionApi.assignMappingPackages(idsToAssignTo, selectedPackagesIds)
            .then((res) => {
                toastSuccess(sectionApi.SECTION_TITLE + ' updated', toastId);
            })
            .catch(err => {
                toastError(err, toastId);
            })
            .finally(() => {
                setIsRunning(false)
                mappingPackagesDialog.handleClose();
                onMappingPackagesAssign()
            });
    };

    return (<>
        <Box align="left">
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
                sx={{px: 3, py: 2}}
            >
                <Typography variant="h6">
                    Mapping Packages
                </Typography>
                <Box
                    spacing={3}>
                    <MappingPackageCheckboxList
                        handleUpdate={setSelectedPackagesIds}
                        mappingPackages={selectedPackagesIds}
                        initProjectMappingPackages={initProjectMappingPackages}
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