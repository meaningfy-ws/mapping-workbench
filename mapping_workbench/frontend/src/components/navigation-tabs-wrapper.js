import Stack from '@mui/material/Stack';
import {useTheme} from '@mui/material/styles';

export const NavigationTabsWrapper = ({children}) => {
    const theme = useTheme()
    console.log(theme)
    return <Stack direction='row'
                  sx={{
                      position: 'fixed',
                      backgroundColor: 'rgba(248, 249, 250, 0.8)',
                      backdropFilter: 'blur(6px)',
                      width: '100%',
                      top: '142px',
                      pt: 2,
                      pb:1,
                      zIndex: 10
                  }}>
        {children}
    </Stack>
}

