import {useContext} from "react";

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {paths} from 'src/paths';
import {useRouter} from "next/router";
import {ProjectsContext} from "src/contexts/projects";

export const ProjectSwitch = () => {

    const projectsStore = useContext(ProjectsContext)
    const router = useRouter();

    const handleProjectSelect = (value) => {
        if (value)
            projectsStore.handleSessionProjectChange(value)
        else
            router.push(paths.app.projects.create)
    }

    return (
        <TextField
            id='project_switch'
            fullWidth
            label="Project"
            name="sessionProject"
            onChange={event => handleProjectSelect(event.target.value)}
            value={projectsStore.sessionProject}
            select
        >
            <MenuItem key={'project_create'}
                id='create_project_button'>
                <Typography color={'green'}>
                    Create Project (+)
                </Typography>
            </MenuItem>
            {projectsStore.items?.map(project => (
                <MenuItem
                    key={project._id}
                    value={project._id}
                >
                    <Typography
                        color="var(--nav-color)"
                        variant="body2"
                    >
                        {project.title}
                    </Typography>
                </MenuItem>
            ))}
        </TextField>
    );
};