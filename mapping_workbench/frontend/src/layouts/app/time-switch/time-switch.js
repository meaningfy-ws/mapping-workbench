import moment from "moment"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Tooltip from '@mui/material/Tooltip';
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import {useGlobalState} from "src/hooks/use-global-state";
import {usePopover} from "src/hooks/use-popover";

const TimeSwitch = () => {

    const popover = usePopover();
    const globalState = useGlobalState()

    const handleTimeUpdate = (timeZone) => {
        popover.handleClose()
        globalState.handleGlobalStateUpdate('timeSetting', timeZone)
    }

    const localTimeZone = moment().utcOffset()
    const getUTC = (timeZone) => {
        return `UTC ${timeZone > 0 ? '+' : ''}${timeZone === 0 ? '' : timeZone/60}`
    }
    const timeZoneItems = [0, 180]

    if(localTimeZone === 120)
        return <Button disabled>{getUTC(localTimeZone)}</Button>
    return (
        <>
          <Tooltip title="Change time zone">
              <Button
                disableElevation
                ref={popover.anchorRef}
                onClick={popover.handleOpen}
                endIcon={<KeyboardArrowDownIcon />}
              >
                  {getUTC(globalState.timeSetting)}
              </Button>
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
              {timeZoneItems.map(timeZone =>
                <MenuItem key={timeZone}
                          onClick={() => handleTimeUpdate(timeZone)}>
                    <Typography color={timeZone === globalState.timeSetting && 'primary'}>{getUTC(timeZone)}</Typography>
                </MenuItem>
              )}
          </Popover>
        </>
    );
};

export default TimeSwitch