import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import { alpha } from '@mui/system/colorManipulator';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AccountButton } from '../account-button';
import { LanguageSwitch } from '../language-switch';
import TimeSwitch from "../time-switch/time-switch";

const BREAK_POINT = 2000;
const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

export const TopNav = (props) => {
    const { onMobileNavOpen, ...other } = props;
    const breakPointUp = useMediaQuery((theme) => theme.breakpoints.up(BREAK_POINT));

    return (
        <Box
            component="header"
            sx={{
                backdropFilter: 'blur(6px)',
                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
                position: 'sticky',
                left:
                    breakPointUp ? `${SIDE_NAV_WIDTH}px` : 0
                ,
                top: 0,
                width: {
                    //xl: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                    xl: '100%'
                },
                zIndex: (theme) => theme.zIndex.appBar
            }}
            {...other}>
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{
                    minHeight: TOP_NAV_HEIGHT,
                    px: 2
                }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                >
                    {!breakPointUp && (
                        <IconButton
                            id='open_sidebar'
                            onClick={onMobileNavOpen}>
                            <SvgIcon>
                                <Menu01Icon />
                            </SvgIcon>
                        </IconButton>
                    )}
                </Stack>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                >
                    <TimeSwitch/>
                    <LanguageSwitch />
                    <AccountButton />
                </Stack>
            </Stack>
        </Box>
    );
};

TopNav.propTypes = {
    onMobileNavOpen: PropTypes.func
};
