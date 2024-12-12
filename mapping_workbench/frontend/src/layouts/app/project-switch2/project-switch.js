import Tooltip from '@mui/material/Tooltip';
import {useContext, useState} from "react";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {useTheme} from '@mui/material/styles';
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import {paths} from 'src/paths';
import {useRouter} from "next/router";
import {Scrollbar} from 'src/components/scrollbar';
import {ProjectsContext} from "src/contexts/projects";

export const ProjectSwitch = ({small}) => {
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

    const projectName = projectsStore.items?.find(project => project._id === projectsStore.sessionProject)?.title
    return (
        <Stack sx={{px: 2}}>
            <Tooltip title={small && projectName}>

                <Stack onClick={handleClick}
                       id='project_switch'
                       direction='row'
                       alignItems='center'
                       justifyContent='center'
                       gap={3}
                       color={'#1D2939'}
                       sx={{
                           backgroundColor: theme.palette.primary.light,
                           borderRadius: '8px',
                           p: '9px',
                           cursor: 'pointer'
                       }}>
                    {!small && projectName}
                    <ArrowForwardIosIcon color='primary'
                                         fontWeight='bold'
                                         fontSize='small'/>
                </Stack>
            </Tooltip>
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
                    <OutlinedInput sx={{m: '16px'}}
                                   placeholder='Search project'
                                   inputProps={{style: {padding: '10px'}}}
                                   onChange={event => setSearchInputValue(event.target.value)}
                                   startAdornment={(
                                       <InputAdornment position="start">
                                           <SearchIcon/>
                                       </InputAdornment>
                                   )}>

                    </OutlinedInput>
                    <Scrollbar sx={{maxHeight: 400}}>
                        {projectsStore.items?.filter(project =>
                            project.title.toLowerCase().includes(searchInputValue.toLowerCase()))
                            .map((project, idx) => (
                                <MenuItem
                                    selected={project._id === projectsStore.sessionProject}
                                    key={project._id}
                                    value={project._id}
                                    sx={{px: '15px', py: '8px'}}
                                    onClick={() => handleProjectSelect(project._id)}
                                >
                                    <Typography
                                        color="#344054"
                                        variant="body2"
                                    >
                                        {project.title}
                                    </Typography>
                                </MenuItem>))}
                    </Scrollbar>
                    <Divider sx={{borderBottomWidth: 2, mx: 2}}
                             style={{marginTop: 16, marginBottom: 16}}/>
                    <MenuItem key='project_create'
                              id='create_project_button'
                              onClick={() => handleProjectSelect(null)}
                              sx={{color: theme.palette.primary.main, mb: 1}}>
                        <AddIcon fontWeight='bold'/>
                        <Typography sx={{ml: '4px'}}
                                    fontWeight='bold'>
                            Create Project
                        </Typography>
                    </MenuItem>
                </Stack>
            </Menu>
        </Stack>
    );
};