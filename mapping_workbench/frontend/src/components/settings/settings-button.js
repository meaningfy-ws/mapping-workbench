import PropTypes from 'prop-types';

import Settings03Icon from '@untitled-ui/icons-react/build/esm/Settings03';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';

export const SettingsButton = (props) => {
    return (
        <Tooltip title="Settings">
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    bottom: 56,
                    boxShadow: 16,
                    margin: (theme) => theme.spacing(4),
                    position: 'fixed',
                    right: 0,
                    opacity: 0.4,
                    transition: 'linear 0.3s',
                    zIndex: (theme) => theme.zIndex.speedDial,
                    ':hover': {
                        opacity: 1
                    }
                }}
                {...props}>
                <ButtonBase
                    sx={{
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        color: 'primary.contrastText',
                        p: '10px'
                    }}
                >
                    <SvgIcon>
                        <Settings03Icon/>
                    </SvgIcon>
                </ButtonBase>
            </Box>
        </Tooltip>
    )
};

SettingsButton.propTypes = {
    onClick: PropTypes.func
};
