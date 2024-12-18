import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {alpha} from '@mui/system/colorManipulator';
import useMediaQuery from '@mui/material/useMediaQuery';
import {sessionApi} from '../../../api/session';

import {AccountButton} from '../account-button';
import {LanguageSwitch} from '../language-switch';
import TimeSwitch from "../time-switch/time-switch";
import {ArrowButtons} from 'src/sections/components/arrow-buttons/arrow-buttons';

const BREAK_POINT = 1500;
const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

export const TopNav = (props) => {
    const {onMobileNavOpen, ...other} = props;
    const breakPointUp = useMediaQuery((theme) => theme.breakpoints.up(BREAK_POINT));
    const project = sessionApi.getSessionProject()

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
                    xl: '100%'
                },
                zIndex: (theme) => theme.zIndex.appBar
            }}
            {...other}>
            <Stack direction='column'>
                <Stack
                    alignItems="center"
                    direction="row"
                    // justifyContent="space-between"
                    spacing={2}
                    sx={{
                        minHeight: TOP_NAV_HEIGHT,
                        p: 2,
                    }}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <IconButton
                            id='open_sidebar'
                            onClick={onMobileNavOpen}>
                            <Menu01Icon/>
                        </IconButton>
                    </Stack>
                    <Stack direction='row'
                           width='100%'
                           alignItems='center'
                           justifyContent='space-between'>
                        <Typography variant="h5"
                                    marginLeft={5}>
                            Mapping Process
                        </Typography>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <TimeSwitch/>
                            <LanguageSwitch/>
                            <AccountButton/>
                        </Stack>
                    </Stack>
                </Stack>
                {project && <Stack alignItems="center" sx={{pb: 2}}>
                    <ArrowButtons/>
                </Stack>}
            </Stack>

        </Box>
    );
};

TopNav.propTypes = {
    onMobileNavOpen: PropTypes.func
};
