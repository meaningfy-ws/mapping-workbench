import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useFormik} from "formik";
import * as Yup from "yup";
import PropTypes from 'prop-types';

import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {projectsApi} from "../../../api/projects";
import {sessionApi} from "../../../api/session";
import {useMounted} from "../../../hooks/use-mounted";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";

const useProjectsStore = () => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: []
    });


    const handleProjectsGet = async () => {
        try {
            if (isMounted()) {
                const projects = await projectsApi.getSessionProjects();
                setState({
                    items: projects,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        handleProjectsGet();
        },[isMounted]);

    return {
        ...state
    };
};

export const ProjectSwitch = (props) => {

    const router = useRouter();
    const projectsStore = useProjectsStore();

    const initialValues = {
        sessionProject: sessionApi.getSessionProject() ?? ''
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
            error={!!(formik.touched.sessionProject && formik.errors.sessionProject)}
            fullWidth
            label="Project"
            name="sessionProject"
            onBlur={formik.handleBlur}
            onChange={handleSessionProjectChange}
            select={true}
            value={projectsStore.items.length ? formik.values.sessionProject : ""}
        >
            {projectsStore.items.map((project) => (
                <MenuItem
                    key={project.id}
                    value={project.id}
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
