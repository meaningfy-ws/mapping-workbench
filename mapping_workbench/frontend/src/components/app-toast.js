import toast from "react-hot-toast";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/HighlightOff";

const defaultDuration = 60000

const toastClose = (content, id) => (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center">
            {content}
            {id && <IconButton sx={{ pr:0 }}
                               onClick={() => toast.dismiss(id)}>
                                <CloseIcon/>
                    </IconButton>}
        </Stack>
    )
export const getToastId = () => toast();

export const toastLoad = (content, id) => (
    toast.loading(toastClose(content, id), {id})
)

export const toastError = (content, id) => (
    toast.error(toastClose(content, id), {id, duration: defaultDuration})
)

export const toastSuccess = (content, id) => (
    toast.success(toastClose(content, id), {id, duration: defaultDuration})
)