import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import {styled} from '@mui/material/styles';
import {MobileNav} from '../mobile-nav';
import {TopNav} from './top-nav';
import {useMobileNav} from './use-mobile-nav';
import {Box} from "@mui/system";

const HorizontalLayoutRoot = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%'
});

const HorizontalLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

export const HorizontalLayout = (props) => {
    const {children, navColor, sections} = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const mobileNav = useMobileNav();

    return (
        <>
            <TopNav
                color={navColor}
                onMobileNav={mobileNav.handleOpen}
                sections={sections}
            />
            {!lgUp && (
                <MobileNav
                    color={navColor}
                    onClose={mobileNav.handleClose}
                    open={mobileNav.open}
                    sections={sections}
                />
            )}
            <HorizontalLayoutRoot>
                <HorizontalLayoutContainer>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 4
                        }}
                    >
                        <Container maxWidth={settings.stretch ? false : 'xl'}>
                            {children}
                        </Container>
                    </Box>
                </HorizontalLayoutContainer>
            </HorizontalLayoutRoot>
        </>
    );
};

HorizontalLayout.propTypes = {
    children: PropTypes.node,
    navColor: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
    sections: PropTypes.array
};
