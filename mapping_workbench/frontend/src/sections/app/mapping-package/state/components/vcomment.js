import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import {COMMENT_PRIORITY, mappingPackageStatesApi} from "src/api/mapping-packages/states";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import {useRouter} from "src/hooks/use-router";
import ValidationCommentContext from "./vcomment-context";
import ConfirmDialog from "src/components/app/dialog/confirm-dialog";

export const validationCommentSeverity = (comment) => {
    switch (comment?.priority) {
        case COMMENT_PRIORITY.HIGH:
            return 'error';
        case COMMENT_PRIORITY.LOW:
            return 'info';
        default:
            return 'success';
    }
}

const ValidationComment = (props) => {
    const {comment, state_id, onDelete, ...other} = props;
    let severity = validationCommentSeverity(comment);

    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

    const handleDeleteComment = (id) => {
        const toastId = toastLoad('Deleting comment...')
        mappingPackageStatesApi.deleteComment(id)
            .then(res => {
                toastSuccess("Comment deleted", toastId);
                onDelete();
            })
            .catch(err => {
                toastError(err, toastId);
            });
    }

    return (
        <>
            <Alert severity={severity}
                   sx={{
                       mb: 2,
                       position: "relative",
                       paddingRight: "20%"
                   }}
            >
                <Box>
                    {comment?.title && <Box><b>{comment.title}</b></Box>}
                    <Box sx={{pb: 1}}>{comment.comment}</Box>
                    <Box>
                        <Chip
                            label={<small><b>by</b> {comment.created_by_username} <b>on</b> {comment.created_at}
                            </small>}
                            color={comment.state_id === state_id ? "success" : "warning"}
                            title={comment.state_id === state_id ? "Native State comment" : "Foreign State comment"}
                            size="small"
                        />
                    </Box>
                    <ValidationCommentContext comment={comment}/>
                    <IconButton
                        onClick={(e) => setConfirmDeleteOpen(true)}
                        size="small"
                        title="Delete Comment"
                        sx={{
                            position: "absolute",
                            top: "5px",
                            right: "5px"
                        }}
                    >
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </Box>
            </Alert>
            <ConfirmDialog
                title={`Delete comment`}
                open={confirmDeleteOpen}
                setOpen={setConfirmDeleteOpen}
                onConfirm={() => handleDeleteComment(comment._id)}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
        </>
    )
}

export const ValidationComments = (props) => {
    const {state_id, validation_element_id, handleUpdate, ...other} = props;

    const router = useRouter();
    const {id, sid, tab, packageid = null, datasetid = null} = router.query;

    const [comments, setComments] = useState([])

    const getComments = () => {
        mappingPackageStatesApi.getComments(state_id, validation_element_id).then(res => {
            setComments(res)
        })
    }
    useEffect(() => {
        getComments()
    }, []);

    const handleDeleteComment = () => {
        getComments()
        handleUpdate()
    }

    const formik = useFormik({
        initialValues: {
            priority: COMMENT_PRIORITY.NORMAL,
            comment: '',
            use_in_state: true
        },
        validationSchema: Yup.object({
            comment: Yup
                .string()
                .required('Comment is required!')
        }),
        onSubmit: (values, helpers) => {
            const toastId = toastLoad('Adding comment...')
            let comment_context_parents = null
            if (datasetid !== null) {
                comment_context_parents = [
                    {
                        report_context: 'suite',
                        context_entity: {
                            id: packageid,
                            name: null
                        }
                    }
                ]
            }
            mappingPackageStatesApi.addComment(
                state_id, validation_element_id, values.comment, values.priority, values.use_in_state,
                {
                    package_id: id,
                    report_type: tab,
                    report_context: datasetid !== null ? 'data' : (packageid !== null ? 'suite' : 'state'),
                    context_entity: {
                        id: datasetid || packageid || sid,
                        name: null
                    },
                    parents: comment_context_parents
                }
            )
                .then(res => {
                    toastSuccess("Comment added", toastId);
                    formik.values.comment = "";
                    getComments()
                    helpers.setStatus({success: true});
                    helpers.setSubmitting(false);
                    handleUpdate();
                })
                .catch(err => {
                    helpers.setStatus({success: false});
                    helpers.setSubmitting(false);
                    toastError(err, toastId);
                });
        }
    });

    return (
        <Card sx={{my: 2, p: 0}}>
            <CardContent sx={{p: 2, m: 0}}>
                {comments.length > 0 && <Box style={{overflow: 'auto', maxHeight: '40vh'}}>
                    {comments.map(
                        (comment, idx) => <ValidationComment
                            key={idx}
                            comment={comment}
                            state_id={state_id}
                            onDelete={handleDeleteComment}
                        />
                    )}
                    <Divider sx={{my: 2}}/>
                </Box>}
                <form onSubmit={formik.handleSubmit}
                      {...other}>
                    <Grid xs={12}
                          md={12}
                          sx={{mt: 1}}>
                        <TextField
                            name="comment"
                            minRows={3}
                            multiline
                            fullWidth
                            label="Add new Comment ..."
                            value={formik.values.comment || ''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            disabled={formik.isSubmitting}
                            required={true}
                            error={!!(formik.touched.comment && formik.errors.comment)}
                            helperText={formik.touched.comment && formik.errors.comment}
                        />
                    </Grid>
                    <Stack
                        component={RadioGroup}
                        defaultValue={COMMENT_PRIORITY.NORMAL}
                        name="priority"
                        spacing={1}
                        onChange={(e) => {
                            formik.setFieldValue('priority', e.target.value);
                        }}
                    >
                        <Box sx={{
                            alignItems: 'flex-start',
                            display: 'flex',
                            py: 2,
                            px: 1
                        }}>
                            <Box sx={{mr: 2, mt: 1}}>
                                <b>Priority:</b>
                            </Box>
                            <FormControlLabel
                                control={<Radio/>}
                                key="priority_high"
                                label={(
                                    <Box sx={{ml: 0, mr: 1}}>
                                        <Typography
                                            variant="subtitle2"
                                        >
                                            High
                                        </Typography>
                                    </Box>
                                )}
                                value={COMMENT_PRIORITY.HIGH}
                                checked={formik.values.priority === COMMENT_PRIORITY.HIGH}
                            />
                            <FormControlLabel
                                control={<Radio/>}
                                key="priority_normal"
                                label={(
                                    <Box sx={{ml: 0, mr: 1}}>
                                        <Typography
                                            variant="subtitle2"
                                        >
                                            Normal
                                        </Typography>
                                    </Box>
                                )}
                                value={COMMENT_PRIORITY.NORMAL}
                                checked={formik.values.priority === COMMENT_PRIORITY.NORMAL}
                            />
                            <FormControlLabel
                                control={<Radio/>}
                                key="priority_low"
                                label={(
                                    <Box sx={{ml: 0, mr: 1}}>
                                        <Typography
                                            variant="subtitle2"
                                        >
                                            Low
                                        </Typography>
                                    </Box>
                                )}
                                value={COMMENT_PRIORITY.LOW}
                                checked={formik.values.priority === COMMENT_PRIORITY.LOW}
                            />
                        </Box>
                        <Divider/>
                        <FormControlLabel
                            sx={{width: '100%', p: 0, m: 0}}
                            control={
                                <Checkbox
                                    checked={formik.values.use_in_state}
                                    onChange={(event) => formik.setFieldValue('use_in_state', event.target.checked)}
                                />
                            }
                            label="Use in this State"
                            value=""
                        />
                        <Divider/>
                    </Stack>
                    <Stack
                        direction={{
                            xs: 'column',
                            sm: 'row'
                        }}
                        flexWrap="wrap"
                        sx={{py: 2}}
                    >
                        <Button
                            disabled={formik.isSubmitting}
                            type="submit"
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    )
}

export default ValidationComments
