import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import {Box} from "@mui/system";

const ConfirmDialog = (props) => {
    const {title, children, open, setOpen, onConfirm, footer} = props;
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <Divider/>
            <DialogContent>
                <Alert severity="warning">{children}</Alert>
                {footer}
            </DialogContent>
            <Divider/>
            <DialogActions>
                <Button
                    id="no_dialog_button"
                    variant="contained"
                    onClick={() => setOpen(false)}
                    color="inherit"
                >
                    No
                </Button>
                <Button
                    id="yes_dialog_button"
                    variant="contained"
                    onClick={() => {
                        setOpen(false);
                        onConfirm();
                    }}
                    color="primary"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;