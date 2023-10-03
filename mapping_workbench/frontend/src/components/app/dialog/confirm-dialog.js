import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

const ConfirmDialog = (props) => {
    const {title, children, open, setOpen, onConfirm} = props;
    console.log(title);
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <Divider/>
            <DialogContent><Alert severity="warning">{children}</Alert></DialogContent>
            <Divider/>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => setOpen(false)}
                    color="secondary"
                >
                    No
                </Button>
                <Button
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