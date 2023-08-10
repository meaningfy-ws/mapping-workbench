import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';

export const ProjectPopover = (props) => {
  const { anchorEl, onChange, onClose, open = false, projects, ...other } = props;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom'
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 180 } }}
      {...other}>
      {projects.map((project) => (
        <MenuItem
          key={project.title}
          onClick={() => onChange?.(project.title)}
        >
          {project.title}
        </MenuItem>
      ))}
    </Popover>
  );
};

ProjectPopover.propTypes = {
  anchorEl: PropTypes.any,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  projects: PropTypes.array.isRequired
};
