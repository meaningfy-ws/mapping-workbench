import Box from '@mui/material/Box';

import { Logo } from 'src/components/logo';

export const SplashScreen = () => (
  <Box
    sx={{
      alignItems: 'center',
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      left: 0,
      p: 3,
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 1400
    }}
  >
    <Box
      sx={{
        display: 'inline-flex',
        height: 120,
        width: 120
      }}
    >
      <Logo />
    </Box>
  </Box>
);
