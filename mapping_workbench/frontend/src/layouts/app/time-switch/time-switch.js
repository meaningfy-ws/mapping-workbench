import {usePopover} from "../../../hooks/use-popover";

import IconButton from '@mui/material/IconButton';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Tooltip from '@mui/material/Tooltip';
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
const TimeSwitch = () => {

  const popover = usePopover();

  return (
    <>
      <Tooltip title="Language">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
            <AccessAlarmIcon/>
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
        <MenuItem>Luxemburg Time</MenuItem>
        <MenuItem>Local Time</MenuItem>
      </Popover>
    </>
  );
};

export default TimeSwitch