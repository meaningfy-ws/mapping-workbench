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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {useRouter} from "../../../../../hooks/use-router";
import {GoToButton, useFileNavigation} from "../utils";

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

const ValidationCommentContext = (props) => {
    const {comment, onDelete, ...other} = props;

    if (!comment?.context?.context_entity?.id) {
        return;
    }
    const context = comment.context;
    let datasetid = null;
    let packageid = null;
    let stateid = context?.state_id;
    let parent_name = null;
    if (context.report_context === 'data') {
        datasetid = context.context_entity.id || null;
        const parent = context.parents?.[0]?.context_entity;
        packageid = parent?.id || null;
        parent_name = parent?.name || null;
    } else if (context.report_context === 'suite') {
        packageid = context.context_entity.id || null;
    } else if (context.report_context === 'state') {
        stateid = context.context_entity.id || null;
    }

    const router = useRouter();
    const {tab} = router.query;

    const {
        handleSetTestAndPackage
    } = useFileNavigation(null, tab, packageid, datasetid, stateid, context.package_id)
    const notice = {
        test_data_suite_oid: packageid,
        test_data_oid: datasetid,
        state_oid: stateid
    }

    return <Box sx={{pt: 1}}>
        <Chip
            label={<small><b>in</b> {(parent_name ? parent_name + " / " : "") + comment.context.context_entity.name} <GoToButton size="small" notice={notice} handleSelect={handleSetTestAndPackage}/></small>}
            color="default"
            size="small"
        />
    </Box>
}

export default ValidationCommentContext