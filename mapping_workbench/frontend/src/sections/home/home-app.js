import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';

export const HomeApp = () => {
    const theme = useTheme();

    return (
        <Typography
            variant="h2"
            sx={{mb: 4}}
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
