import {useDialog} from "../../../../../hooks/use-dialog";
import CommentIcon from '@mui/icons-material/Comment';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {ValidationComments, validationCommentSeverity} from "./vcomment";

const ValidationCommentView = (props) => {
    const {state_id, validation_element_id, comments_count, handleUpdate, ...other} = props;

    const commentsDialog = useDialog()

    const openValidationCommentsDialog = () => {
        commentsDialog.handleOpen({
            title: "Validation Comments",
            content: <ValidationComments
                state_id={state_id}
                validation_element_id={validation_element_id}
                handleUpdate={handleUpdate}
            />
        })
    }

    return (
        <>
            <Button onClick={openValidationCommentsDialog}
                    title={(comments_count && comments_count.count || 0) + " comment(s)"}>
                <CommentIcon
                    color={comments_count && comments_count.latest_comment ? validationCommentSeverity(comments_count.latest_comment) : 'action'}
                />
            </Button>
            <Dialog
                open={commentsDialog.open}
                onClose={commentsDialog.handleClose}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle>
                    {commentsDialog.data?.title}
                </DialogTitle>
                <DialogContent>
                    {commentsDialog.data?.content}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ValidationCommentView