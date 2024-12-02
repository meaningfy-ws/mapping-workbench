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
            <Button variant='contained'
                    onClick={handleClick}
                    endIcon={<ArrowForwardIosIcon
                        fontSize='small'/>}>{projectsStore.items?.find(project => project._id === projectsStore.sessionProject)?.title}</Button>
            <Popover
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
            >

                <Card sx={{border: '1px solid #E4E7EC', width: 250}}>
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

                        <Divider sx={{m: '15px'}} marginHeight={3} marginWidth={3}/>
                        <MenuItem key={'project_create'}
                                  onClick={() => handleProjectSelect()}
                                  sx={{color: theme.palette.primary.main, mb: 2}}
                                  id='create_project_button'>
                            <AddIcon/>
                            <Typography>
                                Create Project
                            </Typography>
                        </MenuItem>
                    </Stack>
                </Card>
            </Popover>
        </Stack>
    )
        ;
};