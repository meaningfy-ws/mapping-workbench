import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import {Box} from "@mui/system";
import Alert from "@mui/material/Alert";


export const EFormsImportValidator = ({onClose, onConfirm, validatedVersions, open = false}) => {
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="confirm-dialog-title">Confirm EForms XSD Import</DialogTitle>
            <Divider/>
            <DialogContent sx={{pb: 0, pt: 0}}>
                {false && !!validatedVersions?.in_project?.length && (
                    <>
                        <Typography variant="h6" sx={{pt:2}}>Versions already in project:</Typography>
                        <Typography sx={{p: 2}}>{validatedVersions.in_project.join(', ')}</Typography>
                        <Divider/>
                    </>)}

                {!!validatedVersions?.not_in_pool?.length && (
                    <>
                        <Typography variant="h6" sx={{pt:2}}>Versions not in APP pool (will be imported from GitHub):</Typography>
                        <Typography sx={{p: 2}}>{validatedVersions.not_in_pool.join(', ')}</Typography>
                        <Divider/>
                    </>)}

                <Alert severity="warning">Do you want to continue importing the EForms XSD?</Alert>
            </DialogContent>
            <Divider/>
            <DialogActions sx={{justifyContent: "center", py: 2}}>
                <Button onClick={onClose} color="primary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="success" variant="outlined" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EFormsImportValidator.propTypes = {
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    validatedVersions: PropTypes.object,
    open: PropTypes.bool
};
