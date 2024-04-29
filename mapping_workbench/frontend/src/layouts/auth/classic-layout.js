import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {styled} from '@mui/material/styles';

import {Logo} from 'src/components/logoWithName';
import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';

const TOP_NAV_HEIGHT = 160;

const LayoutRoot = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center',
    //backgroundImage: 'url("/assets/gradient-bg.svg")',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%'
}));

export const Layout = (props) => {
    const {children} = props;

    return (
        <LayoutRoot>
            <Box
                component="header"
                sx={{
                    left: 0,
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    zIndex: (theme) => theme.zIndex.appBar
                }}
            >
                <Container maxWidth="lg">
                </Container>
            </Box>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flex: '1 1 auto'
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        py: {
                            xs: '60px',
                            md: '120px'
                        }
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={2}
                        sx={{height: TOP_NAV_HEIGHT}}
                    >
                        <Stack
                            alignItems="center"
                            component={RouterLink}
                            direction="column"
                            display="inline-flex"
                            href={paths.index}
                            spacing={1}
                            sx={{textDecoration: 'none'}}
                        >
                            <Logo/>
                        </Stack>
                    </Stack>
                    {children}
                </Container>
            </Box>
        </LayoutRoot>
    );
};

Layout.propTypes = {
    children: PropTypes.node
};
