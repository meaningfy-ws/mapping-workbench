import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import {COMMENT_PRIORITY, conceptualMappingRulesApi} from "../../../api/conceptual-mapping-rules";
import Box from "@mui/system/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import {useEffect, useState} from "react";
import Alert from "@mui/material/Alert";
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const CMRuleNote = (props) => {
    const {note, ...other} = props;

    let severity;
    switch (note?.priority) {
        case COMMENT_PRIORITY.HIGH:
            severity = 'error';
            break;
        case COMMENT_PRIORITY.LOW:
            severity = 'info';
            break;
        default:
            severity = 'success';
            break;
    }

    return (
        <Alert severity={severity}
               sx={{
                   mb: 2
               }}
        >
            <Box>
                {note?.title && <Box><b>{note.title}</b></Box>}
                <Box sx={{pb: 1}}>{note.comment}</Box>
                <small><b>by</b> {note.created_by?.email}</small>
            </Box>
        </Alert>
    )
}

const CMNotes = (props) => {
    const {cm_rule, comment_type, ...other} = props;
    const [notes, setNotes] = useState([])

    const getNotes = () => {
        conceptualMappingRulesApi.getNotes(cm_rule._id, comment_type).then(res => {
            setNotes(res)
        })
    }
    useEffect(() => {
        getNotes()
    }, []);

    const formik = useFormik({
        initialValues: {
            comment: ''
        },
        validationSchema: Yup.object({
            comment: Yup
                .string()
                .required('Comment is required!')
        }),
        onSubmit: (values, helpers) => {
            conceptualMappingRulesApi.addNote(cm_rule._id, comment_type, values.comment)
                .then(res => {
                    formik.values.comment = "";
                    getNotes()
                    helpers.setStatus({success: true});
                    helpers.setSubmitting(false);
                });
        }
    });

    return (
        <Card sx={{my: 2, p: 0}}>
            <CardContent sx={{p: 2, m: 0}}>
                {notes.length > 0 && <Box style={{overflow: 'auto', maxHeight: '40vh'}}>
                    {notes.map(
                        (note, idx) => <CMRuleNote
                            key={idx}
                            note={note}
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
                            label="Add new Note ..."
                            value={formik.values.comment && formik.values.comment || ''}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                        />
                    </Grid>
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

export default CMNotes