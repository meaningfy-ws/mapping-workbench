import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {useGlobalState} from "../../../hooks/use-global-state";

export const VersionLabel = () => {
    const globalSettings = useGlobalState()

    return (
        <Typography
            variant='subtitle2'
            color='gray' sx={{my: 1}}
        >
            <Stack alignItems='center'>{globalSettings.version}</Stack>
        </Typography>)
}