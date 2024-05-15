import IconButton from '@mui/material/IconButton';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Tooltip from '@mui/material/Tooltip';
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {useGlobalState} from "../../../hooks/use-global-state";
import {usePopover} from "../../../hooks/use-popover";
const TimeSwitch = () => {

    const popover = usePopover();
    const globalState = useGlobalState()
    const isActive = globalState.timeSetting === 'luxembourg'

    const handleTimeUpdate = (time) => {
        popover.handleClose()
        globalState.handleGlobalStateUpdate('timeSetting', time)
    }

    return (
    <>
      <Tooltip title="Language">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
            <AccessAlarmIcon color={isActive ? 'primary' :'' }/>
        </IconButton>
      </Tooltip>
      <Popover open={popover.open}
               anchorEl={popover.anchorRef.current}
               onClose={popover.handleClose}
               anchorOrigin={{
                   horizontal: 'right',
                   vertical: 'bottom'
               }}
               disableScrollLock
               transformOrigin={{
                   horizontal: 'right',
                   vertical: 'top'
               }}
               PaperProps={{ sx: { width: 220 } }}
      >
        <MenuItem onClick={() => handleTimeUpdate('luxembourg')}>
            <Typography color={isActive && 'primary'}>Luxembourg Time</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleTimeUpdate('local')}>
            <Typography color={!isActive && 'primary'}>Local Time</Typography>
        </MenuItem>
      </Popover>
    </>
    );
};

export default TimeSwitch