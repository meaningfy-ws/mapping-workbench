import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import Stack from '@mui/material/Stack';

export const AppTitle = (props) => {
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            {...props}>
            <Typography variant="h6">
                Mapping Workbench
            </Typography>
        </Stack>
    );
};