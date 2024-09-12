import {useEffect, useState} from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Card from "@mui/material/Card";
import CMQuery from "./cm-query";
import {COMMENT_TYPE, conceptualMappingRulesApi} from "../../../api/conceptual-mapping-rules";
import {PropertyListItem} from "../../../components/property-list-item";
import {PropertyList} from "../../../components/property-list";
import {fieldsRegistryApi} from "../../../api/fields-registry";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import {useDialog} from "../../../hooks/use-dialog";
import CMNotes from "./cm-notes";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";

const CMCard = (props) => {
    const {cm_rule, structural_element, cm_statuses, ...other} = props;

    const notesDialog = useDialog()
    const [status, setStatus] = useState(cm_rule.status)
    const [structuralElement, setStructuralElement] = useState(structural_element);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!structuralElement) {
            fieldsRegistryApi.getItem(cm_rule.source_structural_element?.id, 'element').then(res => {
                setStructuralElement(res)
            })
        }
    }, []);

    const handleStatusChange = (e) => {
        setIsSubmitting(true)
        const toastId = toastLoad('Updating...')
        const status = e.target.value
        setStatus(status)
        conceptualMappingRulesApi.updateItem({
            id: cm_rule._id,
            project: cm_rule.project?.id,
            status: status,
            source_structural_element: cm_rule.source_structural_element?.id
        }).then(res => {
            setIsSubmitting(false)
            toastSuccess("Status updated", toastId);
        }).catch(err => {
            setIsSubmitting(false)
            toastError(err, toastId);
        })
    }

    const openMappingNotesDialog = () => {
        notesDialog.handleOpen({
            title: "Mapping Notes",
            content: <CMNotes
                cm_rule={cm_rule}
                comment_type={COMMENT_TYPE.MAPPING}
            />
        })
    }

    const openFeedbackNotesDialog = () => {
        notesDialog.handleOpen({
            title: "Feedback Notes",
            content: <CMNotes
                cm_rule={cm_rule}
                comment_type={COMMENT_TYPE.FEEDBACK}
            />
        })
    }

    const openEditorialNotesDialog = () => {
        notesDialog.handleOpen({
            title: "Editorial Notes",
            content: <CMNotes
                cm_rule={cm_rule}
                comment_type={COMMENT_TYPE.EDITORIAL}
            />
        })
    }

    return (
        <>
            <Card>
                <Stack direction={{xs: 'column', xl: 'row-reverse'}}
                       justifyContent={{xs: 'space-between'}}
                       alignItems="flex-start"

                    // display='block'
                       margin={3}>
                    <Stack direction={{xs: 'row', xl: 'column'}}
                           width={{xs: '100%', xl: 'auto'}}
                           justifyContent='space-between'
                        // alignItems='center'
                    >
                        <TextField select
                                   sx={{minWidth: 200}}
                                   onChange={handleStatusChange}
                                   label="Status"
                                   value={status}
                                   disabled={isSubmitting}
                                   name="status">
                            {cm_statuses.map(status =>
                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    <Typography
                                        color="var(--nav-color)"
                                        variant="body2"
                                    >
                                        {status}
                                    </Typography>
                                </MenuItem>
                            )}
                        </TextField>
                        <Stack direction={{xs: 'row', xl: 'column'}}>
                            <Button onClick={openEditorialNotesDialog}>Editorial Notes</Button>
                            <Button onClick={openFeedbackNotesDialog}>Feedback Notes</Button>
                            <Button onClick={openMappingNotesDialog}>Mappings Notes</Button>
                        </Stack>
                    </Stack>
                    <Box width={{xs: '100%', xl: '80%'}}>
                        <PropertyList>
                            <PropertyListItem
                                label="Min/Max version"
                                value={(cm_rule?.min_sdk_version || "") + "/" + (cm_rule?.max_sdk_version || "")}
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    py: 1.5
                                }}
                            />
                            <PropertyListItem
                                label="Parent ID"
                                value={structuralElement?.parent_node_id}
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    py: 1.5
                                }}
                            />
                            <PropertyListItem
                                label="XPath expression"
                                value={structuralElement?.absolute_xpath}
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    py: 1.5
                                }}
                            />
                            <PropertyListItem
                                label="Ontology Fragment"
                                value={(cm_rule.target_class_path || "") + "\n" + (cm_rule.target_property_path || "")}
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    py: 1.5
                                }}
                            />
                        </PropertyList>
                        <hr width="100%"/>
                        <Box>
                            {cm_rule.sparql_assertions && cm_rule.sparql_assertions.map(cm_query => <CMQuery
                                key={cm_query.id}
                                cm_query_id={cm_query.id}
                            />)}
                        </Box>
                    </Box>
                </Stack>
            </Card>
            <Dialog
                open={notesDialog.open}
                onClose={notesDialog.handleClose}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle>
                    {notesDialog.data?.title}
                </DialogTitle>
                <DialogContent>
                    {notesDialog.data?.content}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CMCard