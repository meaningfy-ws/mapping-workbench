import { Fragment, useContext, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Avatar, Box, Divider, FormControl, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Select,Tooltip } from '@mui/material';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';
import { ReactComponent as MappingWorkbench } from '../../assets/mapping-workbench-logo.svg';
import { UserContext } from "../../contexts/user.context";

import { signOutUser } from '../../utils/firebase/firebase.utils';
//import { getAuth } from "firebase/auth";
import './navigation.component.scss';

const Navigation = () => {
    const { currentUser } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();
    const [input, setInput] = useState('');

    const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

    //const auth = getAuth();

    //const user = auth.currentUser;
    //console.log('USER:', auth);

    //console.log('currentUser:', currentUser);

    const CustomLink = ({to, children }) => {
        //const resolvedPath = useResolvedPath(to);
        //const isActive = useMatch({ path: resolvedPath.pathname, end: true});

        return (
            <Link className={'nav-link'} to={to}>
                {children}
            </Link>
        )
    }
    
    const signOutUserAndRedirect = () => {
        signOutUser();
        setInput('');
        navigate("/auth");
    }

    const handleChange = (e) => {
        setInput(e.target.value);
        switch (e.target.value) {
            case 'ted-rdf-mapping':
                navigate("/project-management/ted-rdf-mapping");
                break;
            case 'rdf-fingerprinter-ws':
                navigate("/project-management/rdf-fingerprinter-ws");
                break;
            case 'mapping-workbench':
                navigate("/project-management/mapping-workbench");
                break;
            case 'CREATE NEW PROJECT':
                navigate("/project-management/new-project");
                //console.log('CREATE NEW PROJECT');
                break;    
            default:
                console.log('switch default reached!')    
        }
    }

    return (
      <Fragment>
        <div className="navigation">
            <CustomLink className="logo-container" to='/'>
                <MappingWorkbench className='logo' />
            </CustomLink> 
            <div className="nav-links-container">
                    {
                        currentUser ? (
                            <div className="startMenu">
                                <FormControl sx={{ m: 1, minWidth: 203 }} size="small">
                                    <InputLabel id='start-menu-label'>Projects</InputLabel>
                                    <Select
                                    labelId="start-menu-label"
                                    id="start-menu"
                                    value={input}
                                    label="Projects"
                                    onChange={handleChange}
                                    autoWidth
                                    >                                
                                        {/* <MenuItem value={'mapping-workbench'}> mapping-workbench </MenuItem>
                                        <MenuItem value={'rdf-fingerprinter-ws'}> rdf-fingerprinter-ws </MenuItem>*/}
                                        <MenuItem value={'ted-rdf-mapping'}> ted-rdf-mapping </MenuItem>                                       
                                        <br className="break-line"/>
                                        <MenuItem value={'CREATE NEW PROJECT'}> CREATE NEW PROJECT </MenuItem>
                                    </Select>
                                </FormControl>                    
                            </div>
                        ):( '' )
                    }
                    {
                        currentUser ? (
                            <span className="nav-link" onClick={signOutUserAndRedirect}> SIGN OUT </span>
                            ) : (
                            <CustomLink className='nav-link' to='/auth'>
                                SIGN IN
                            </CustomLink>)
                        
                    }
            </div>

            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>J</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu> 
        </div>
        <Outlet />
      </Fragment>
    )
  }

  export default Navigation;