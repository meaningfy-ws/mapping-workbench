import {useContext} from "react";
import {useRouter} from "next/router";
import {useFormik} from "formik";
import * as Yup from "yup";
import PropTypes from 'prop-types';

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {sessionApi} from "../../../api/session";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {ProjectsContext} from "../../../contexts/projects";

export const ProjectSwitch = (props) => {

    const router = useRouter();
    const projectsStore = useContext(ProjectsContext)


    console.log('projectsStore',projectsStore)

    const initialValues = {
        sessionProject: projectsStore.selectedProject ?? ''
    };

    const validationSchema = Yup.object({
        sessionProject: Yup.string().required()
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                // NOTE: Make API request
                toastSuccess('Project changed');
            } catch (err) {
                console.error(err);
                toastError(err);
            }
        },
    });

    const handleSessionProjectChange = async (event) => {
        const value = event.target.value;
        toastLoad('Selecting project...');
        await sessionApi.setSessionProject(value);
        formik.setFieldValue('sessionProject', value);
        // router.reload();
    }

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

ProjectSwitch.propTypes = {
    sx: PropTypes.object
};
