import {cloneElement, useState} from 'react';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export const MenuActions = ({children}) => {
    const [anchor, setAnchor] = useState(null)
    return <>
        <Tooltip title='Actions'>
            <IconButton onClick={e => setAnchor(e.target)}>
                <MoreHorizIcon/>
            </IconButton>
        </Tooltip>
        <Menu anchorEl={anchor}
              open={!!anchor}
              onClose={() => setAnchor(null)}>
            {children}
        </Menu>
    </>
}

export const MenuActionButton = ({icon, title, last, ...other}) => {
    const theme = useTheme()
    return <MenuItem sx={{...(!last && {borderBottom: `1px solid ${theme.palette.divider}`})}}
                     {...other}
    >
        {icon && <ListItemIcon sx={{mr: 0}}>
            {cloneElement(icon, {color: 'primary'})}
        </ListItemIcon>}
        {title && <ListItemText>{title}</ListItemText>}
    </MenuItem>
}