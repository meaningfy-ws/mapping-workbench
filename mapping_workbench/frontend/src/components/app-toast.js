import toast from "react-hot-toast";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/HighlightOff";

const toastClose = (content, id) => (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center">
            {content}
            {id && <IconButton onClick={() => toast.dismiss(id)}><CloseIcon/></IconButton>}
        </Stack>
    )
export const getToastId = () => toast();

export const toastLoad = (content, id) => (
    toast.loading(toastClose(content, id), {id})
)

export const toastError = (content, id) => (
    toast.error(toastClose(content, id), {id, duration: 60000})
)

export const toastSuccess = (content, id) => (
    toast.success(toastClose(content, id), {id, duration: 60000})
)