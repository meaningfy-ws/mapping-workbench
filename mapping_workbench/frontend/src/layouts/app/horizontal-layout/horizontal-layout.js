import PropTypes from 'prop-types';

import {Box} from "@mui/system";
import {styled} from '@mui/material/styles';
import Container from "@mui/material/Container";
import useMediaQuery from '@mui/material/useMediaQuery';
import {ArrowButtons} from '../../../sections/components/arrow-buttons/arrow-buttons';

import {TopNav} from './top-nav';
import {MobileNav} from '../mobile-nav';
import {useMobileNav} from './use-mobile-nav';
import {useSettings} from "src/hooks/use-settings";

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
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
    const mobileNav = useMobileNav();
    const settings = useSettings();

    return (
        <>
            <TopNav
                color={navColor}
                onMobileNav={mobileNav.handleOpen}
                sections={sections}
                mdUp={mdUp}
            />
            {!mdUp && (
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
    sections: PropTypes.object
};
