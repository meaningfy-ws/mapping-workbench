import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';

export const HomeApp = () => {
    const theme = useTheme();

    return (
        <Typography
            variant="h1"
            sx={{mb: 2}}
        >
            <Typography
                component="span"
                color="primary.main"
                variant="inherit"
            >
                Mapping Workbench
            </Typography>
        </Typography>
    );
};
