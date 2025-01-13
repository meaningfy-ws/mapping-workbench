import Stack from '@mui/material/Stack';
import {alpha} from "@mui/system/colorManipulator";

export const NavigationTabsWrapper = ({children}) => {
    return <Stack direction='row'
                  sx={{
                      position: 'fixed',
                      backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
                      backdropFilter: 'blur(6px)',
                      width: '100%',
                      top: '140px',
                      //pt: 2,
                      pb:1,
                      zIndex: 10
                  }}>
        {children}
    </Stack>
}

