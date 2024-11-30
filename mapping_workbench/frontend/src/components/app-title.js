import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";
import Stack from '@mui/material/Stack';

export const AppTitle = (props) => {
    const theme = useTheme();
    const fillColor = theme.palette.primary.main;
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            {...props}>
            <Typography sx={{fontSize: 18, fontWeight: 'bold', color: fillColor}}>
                Mapping Workbench
            </Typography>
        </Stack>
    );
};