import {cloneElement} from 'react';

import {useTheme} from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export const MenuActionButton = ({id, icon, text, action, last}) => {
    const theme = useTheme()
    return <MenuItem id={id}
                     onClick={action}
                     sx={{...(!last && {borderBottom: `1px solid ${theme.palette.divider}`})}}>
        {icon && <ListItemIcon sx={{mr: 0}}>
            {cloneElement(icon, {color: 'primary'})}
        </ListItemIcon>}
        {text && <ListItemText>{text}</ListItemText>}
    </MenuItem>
}