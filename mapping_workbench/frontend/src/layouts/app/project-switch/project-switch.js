import {useContext} from "react";
import PropTypes from 'prop-types';

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {ProjectsContext} from "../../../contexts/projects";

export const ProjectSwitch = () => {

    const projectsStore = useContext(ProjectsContext)

    return (
        <TextField
            fullWidth
            label="Project"
            name="sessionProject"
            onChange={event => projectsStore.handleSessionProjectChange(event.target.value)}
            value={projectsStore.sessionProject}
            select
        >
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