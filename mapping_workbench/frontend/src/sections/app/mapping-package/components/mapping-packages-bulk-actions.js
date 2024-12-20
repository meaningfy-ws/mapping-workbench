import {useState} from "react";
import {useRouter} from 'next/router';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SvgIcon from "@mui/material/SvgIcon";
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {useDialog} from "src/hooks/use-dialog";
import ConfirmDialog from '../../../../components/app/dialog/confirm-dialog';
import {MappingPackageProcessForm} from './mapping-package-process-form';

export const MappingPackagesBulkActions = (props) => {
    const {
        disabled,
        items
    } = props;

    const router = useRouter()
    const mappingPackagesDialog = useDialog()

    const [isRunning, setIsRunning] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [cleanUpProject, setCleanUpProject] = useState(false)

    const handleDeleteAction = (items, cleanup_project = false) => {
        setIsRunning(true)
        items.forEach((item, i) =>
            sectionApi.deleteMappingPackageWithCleanup(item._id, cleanup_project)
                .finally(() => {
                        if (i === items.length - 1) {
                            setIsRunning(false)
                            router.reload()
                        }
                    }
                )
        )
    }

    return (<>
        <Box align="left">
            <Button
                type='link'
                onClick={mappingPackagesDialog.handleOpen}
                disabled={disabled || isRunning}
                startIcon={(
                    <SvgIcon>
                        <PlayArrowIcon/>
                    </SvgIcon>
                )}
                size="small"
                variant="text"
                id="assign-mapping-packages_button"
            >
                Bulk Actions
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
                    Mapping Packages Bulk Actions
                </Typography>
                <MappingPackageProcessForm sectionApi={sectionApi}
                                           items={items}/>
                <LoadingButton
                    variant="contained"
                    size="small"
                    color="error"
                    disabled={isRunning}
                    loading={isRunning}
                    onClick={() => setConfirmOpen(true)}
                >
                    Delete Packages
                </LoadingButton>
            </Stack>
            <ConfirmDialog
                title={`You are about to delete ${items.length} packages, proceed?`}
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => handleDeleteAction(items, cleanUpProject)}
                footer={<Box sx={{
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={cleanUpProject}
                                onChange={e => setCleanUpProject(e.target.checked)}
                            />
                        }
                        label="Cleanup Project Assets"
                        value="cleanup_project"
                    />
                </Box>}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
        </Dialog>
    </>)
}