import PropTypes from 'prop-types';
import {useCallback, useEffect, useState} from "react";
import {projectsApi} from "../../../api/projects";
import {sessionApi} from "../../../api/session";
import {useMounted} from "../../../hooks/use-mounted";
import * as Yup from "yup";
import {useFormik} from "formik";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {useRouter} from "../../../hooks/use-router";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

const useProjectsStore = () => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: []
    });

    const handleProjectsGet = useCallback(async () => {
        try {
            const projects = await projectsApi.getSessionProjects();
            if (isMounted()) {
                setState({
                    items: projects,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted]);

    useEffect(() => {
            handleProjectsGet();
        },
        []);

    return {
        ...state
    };
};

export const ProjectSwitch = (props) => {
    const router = useRouter();
    const projectsStore = useProjectsStore();

    const initialValues = {
        sessionProject: sessionApi.getSessionProject() || ''
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
                toast.success('Project changed');
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
            }
        },
    });

    const handleSessionProjectChange = useCallback(async (event) => {
        let value = event.target.value;
        toast.loading('Selecting project...');
        await sessionApi.setSessionProject(value);
        formik.setFieldValue('sessionProject', value);
        router.reload();
    }, [formik])

    return (
        <>
            <TextField
                error={!!(formik.touched.sessionProject && formik.errors.sessionProject)}
                fullWidth
                label="Project"
                name="sessionProject"
                onBlur={formik.handleBlur}
                onChange={handleSessionProjectChange}
                select={true}
                value={formik.values.sessionProject}
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
        </>
    );
};

ProjectSwitch.propTypes = {
    sx: PropTypes.object
};
