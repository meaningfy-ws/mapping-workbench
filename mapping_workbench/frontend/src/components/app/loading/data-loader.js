import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export const DataLoader = () => {
    return <>
        <Paper sx={{p: 3}}>
            <Stack alignItems='center'>
                <CircularProgress/>
            </Stack>
        </Paper>
    </>
}