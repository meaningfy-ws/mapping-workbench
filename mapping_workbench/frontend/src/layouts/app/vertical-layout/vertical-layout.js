import PropTypes from 'prop-types';

import {Box} from "@mui/system";
import {styled} from '@mui/material/styles';
import Container from "@mui/material/Container";
import useMediaQuery from '@mui/material/useMediaQuery';

import {TopNav} from './top-nav';
import {SideNav} from './side-nav';
import {MobileNav} from '../mobile-nav';
import {useMobileNav} from './use-mobile-nav';
import {useSettings} from "src/hooks/use-settings";

const BREAK_POINT = 1500;
const SIDE_NAV_WIDTH = 88;

const VerticalLayoutRoot = styled('div')(({theme}) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up(BREAK_POINT)]: {
        paddingLeft: SIDE_NAV_WIDTH
    }
}));

const VerticalLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

export const VerticalLayout = (props) => {
    const {children, sections, navColor} = props;
    const breakPointUp = useMediaQuery((theme) => theme.breakpoints.up(BREAK_POINT));
    const mobileNav = useMobileNav();
    const settings = useSettings();

    return (
        <>
            <TopNav onMobileNavOpen={mobileNav.handleOpen}/>
            {breakPointUp ?
                <SideNav
                    color={navColor}
                    sections={sections}
                    small
                />
                :
                <MobileNav
                    color={navColor}
                    onClose={mobileNav.handleClose}
                    open={mobileNav.open}
                    sections={sections}
                />
            }
            <VerticalLayoutRoot>
                <VerticalLayoutContainer>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 4
                        }}
                    >
                        <Container maxWidth={settings.stretch ? false : BREAK_POINT}>
                            {children}
                        </Container>
                    </Box>
                </VerticalLayoutContainer>
            </VerticalLayoutRoot>
        </>
    );
};

VerticalLayout.propTypes = {
    children: PropTypes.node,
    navColor: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
    sections: PropTypes.object
};
