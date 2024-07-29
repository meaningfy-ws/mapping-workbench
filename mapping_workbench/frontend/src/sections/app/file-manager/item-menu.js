import PropTypes from 'prop-types';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import EditIcon from '@untitled-ui/icons-react/build/esm/Edit02';
import Menu from '@mui/material/Menu';
import MenuItem, {menuItemClasses} from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

export const ItemMenu = (props) => {
  const { anchorEl, onClose, onEdit, onDelete, open = false } = props;

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      sx={{
        [`& .${menuItemClasses.root}`]: {
          fontSize: 14,
          '& svg': {
            mr: 1
          }
        }
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top'
      }}
    >
      <MenuItem onClick={onClose}>
        <SvgIcon fontSize="small">
          <Link01Icon />
        </SvgIcon>
        Copy Link
      </MenuItem>
      {onEdit && <MenuItem
          id='edit_menu_item'
          onClick={onEdit}
      >
        <SvgIcon fontSize="small">
          <EditIcon />
        </SvgIcon>
        Edit
      </MenuItem>}
      <MenuItem
          id='delete_menu_item'
          onClick={onDelete}
          sx={{ color: 'error.main' }}
      >
        <SvgIcon fontSize="small">
          <Trash02Icon />
        </SvgIcon>
        Delete
      </MenuItem>
    </Menu>
  );
};

ItemMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool
};
