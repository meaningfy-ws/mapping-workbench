import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import {Box} from '@mui/system';
import {useContext, useState} from "react";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {useTheme} from '@mui/material/styles';
import Button from '@mui/material/Button';

import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {ProjectsContext} from "../../../contexts/projects";
import {useRouter} from "../../../hooks/use-router";
import {paths} from 'src/paths';

export const ProjectSwitch = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const projectsStore = useContext(ProjectsContext)
    const [searchInputValue, setSearchInputValue] = useState('')
    const router = useRouter();
    const theme = useTheme()


    const handleProjectSelect = (value) => {
        if (value)
            projectsStore.handleSessionProjectChange(value)
        else
            router.push(paths.app.projects.create)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<Stack sx={{px: 2}}>
            {/*<Chip variant='contained'*/}
            {/*      color='primary'*/}
            {/*      icon={<ArrowForwardIosIcon*/}
            {/*          fontSize='small'/>}*/}
            {/*      label={projectsStore.items?.find(project => project._id === projectsStore.sessionProject)?.title}*/}
            {/*      clickable*/}
            {/*      onClick={handleClick}/>*/}
            <Stack onClick={handleClick}
                   direction='row'
                   alignItems='center'
                   justifyContent='center'
                   gap={3}
                 sx={{backgroundColor: '#f0edf9', borderRadius: '8px', p: '9px', cursor:'pointer'}}>
                {projectsStore.items?.find(project => project._id === projectsStore.sessionProject)?.title}
                <ArrowForwardIosIcon color='primary'
                                     fontWeight='bold'
                                     fontSize='small'/>
            </Stack>
            <Menu
                id={'project_switch_popover'}
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                width={'250px'}
            >

                <Stack direction='column'>
                    <OutlinedInput sx={{m: '16px', backgroundColor: '#F2F4F7',}}
                                   placeholder='Search project'
                                   inputProps={{style: {padding: '10px'}}}
                                   onChange={event => setSearchInputValue(event.target.value)}
                                   startAdornment={(
                                       <InputAdornment position="start">
                                           <SearchIcon/>
                                       </InputAdornment>
                                   )}>

                    </OutlinedInput>
                    {projectsStore.items?.filter(project => project.title.toLowerCase()
                        .includes(searchInputValue.toLowerCase()))
                        .map(project => (
                            <MenuItem
                                key={project._id}
                                value={project._id}
                                sx={{px: '15px', py: '8px'}}
                                onClick={() => handleProjectSelect(project._id)}
                            >
                                <Typography
                                    color="var(--nav-color)"
                                    variant="body2"
                                >
                                    {project.title}
                                </Typography>
                            </MenuItem>))}
                    <Divider sx={{m: '15px'}}/>
                    <MenuItem key={'project_create'}
                              onClick={() => handleProjectSelect()}
                              sx={{color: theme.palette.primary.main, mb: 2}}
                              id='create_project_button'>
                        <AddIcon fontWeight='bold'/>
                        <Typography sx={{ml: '4px'}}
                                    fontWeight='bold'>
                            Create Project
                        </Typography>
                    </MenuItem>
                </Stack>
            </Menu>
        </Stack>
    )
        ;
};