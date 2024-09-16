import {useState} from "react";
import toast from "react-hot-toast";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/HighlightOff";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';

const defaultDuration = 60000

const toastClose = (content, id) => (
    <Stack sx={{
        position: 'relative'
    }}>
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center">
            {content}
            {id && <IconButton sx={{pr: 0}}
                               onClick={() => toast.dismiss(id)}>
                <CloseIcon/>
            </IconButton>}
        </Stack>
    </Stack>
)


const ToastErrorModel = ({err, id}) => {
    const [show, setShow] = useState(false)
    let detailStr = err.response?.data?.detail
    detailStr = !Array.isArray(detailStr) ? detailStr : detailStr?.[0]?.msg
    return (
        <Stack sx={{
            position: 'relative'
        }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center">
                <CancelIcon sx={{color: '#ff4b4b', mr:2}}/>
                {err.message}
                {id && <IconButton sx={{pr: 0}}
                                   onClick={() => toast.dismiss(id)}>
                    <CloseIcon/>
                </IconButton>}
            </Stack>
            {!show && detailStr && <Button onClick={() => setShow(true)}
                              variant="primary">Show details...</Button>}
            <Collapse in={show}>
                <Typography sx={{overflowX: "auto"}}
                            variant="subtitle2">
                    {detailStr}
                </Typography>
            </Collapse>
        </Stack>
    )
}

export const getToastId = () => toast();

export const toastLoad = (content, id) => (
    toast.loading(toastClose(content, id), {id})
)

export const toastError = (err, id) => (
    toast(<ToastErrorModel err={err}
                           id={id} />,{id, duration: defaultDuration})
)

export const toastSuccess = (content, id) => (
    toast.success(toastClose(content, id), {id, duration: defaultDuration})
)

export const toastWarning = (content, id) => (
    toast.success(toastClose(content, id), {id: id,
        icon: <WarningIcon/>,
        duration: defaultDuration,
        style: {
            color: '#FFA500'
        }
    })
)