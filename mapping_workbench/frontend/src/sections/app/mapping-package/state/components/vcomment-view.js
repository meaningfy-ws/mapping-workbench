import {useDialog} from "../../../../../hooks/use-dialog";
import CommentIcon from '@mui/icons-material/Comment';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {ValidationComments, validationCommentSeverity} from "./vcomment";
import Badge from "@mui/material/Badge";

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
    const iconColor = validationCommentSeverity(comments_count?.latest_comment);
    const nb_comments = comments_count && comments_count.count || 0;
    return (
        <>
            <Button onClick={openValidationCommentsDialog}
                    title={nb_comments + " comment(s)"}>
                {comments_count?.latest_comment && <Badge badgeContent={nb_comments} color={iconColor}
                       overlap="circular"
                       anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                    <CommentIcon color={iconColor}/>
                </Badge>}
                {!comments_count?.latest_comment && <CommentIcon color='action'/>}
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