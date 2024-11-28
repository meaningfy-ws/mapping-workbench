import {useState} from 'react';
import {useRouter} from 'next/router';

import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/system/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import {testDataFileResourcesApi as fileResourcesApi} from '../../../api/test-data-suites/file-resources';
import ConfirmDialog from '../../../components/app/dialog/confirm-dialog';
import {paths} from '../../../paths';


export const TestDataSuitesResourcesDialog = ({itemId, collectionResources, open, handleClose, sectionApi}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const router = useRouter()

    const handleResourceEdit = resource_id => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.edit,
            query: {id: itemId, fid: resource_id}
        });
        return true;
    }


    const handleDeleteResourceAction = () => {
        fileResourcesApi.deleteFileResource(itemId)
            .then(res => handleClose)
    }

    return (
        <>
            <Dialog open={open}
                    onClose={handleClose}>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography variant="h6">
                        Test Data Suites Resources
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Stack>

                <DialogContent>
                    {collectionResources.length > 0 ?
                        <Box sx={{mt: 2}}>
                            <Stack divider={<Divider/>}>
                                {collectionResources.map(resource =>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        flexWrap="wrap"
                                        justifyContent="space-between"
                                        key={resource._id}
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                        }}
                                    >
                                        <div>
                                            <Typography variant="subtitle1">{resource.title}</Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="caption"
                                            >
                                                {}
                                            </Typography>
                                        </div>
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={2}
                                        >
                                            <Button
                                                size="small"
                                                onClick={() => handleResourceEdit?.(resource._id)}
                                                color="success">
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={() => setConfirmOpen(resource._id)}
                                                color="error">
                                                Delete
                                            </Button>
                                        </Stack>
                                    </Stack>)}
                            </Stack>
                        </Box>
                        : <Alert severity='info'>No resources</Alert>}
                </DialogContent>
            </Dialog>
            <ConfirmDialog
                title="Delete It?"
                open={!!confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={handleDeleteResourceAction}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
        </>
    )
}