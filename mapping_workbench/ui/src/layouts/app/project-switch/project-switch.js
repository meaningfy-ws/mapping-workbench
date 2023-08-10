import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {usePopover} from 'src/hooks/use-popover';

import {ProjectPopover} from './project-popover';
import {useCallback, useEffect, useState} from "react";
import {projectsApi as sectionApi} from "../../../api/projects";
import {useMounted} from "../../../hooks/use-mounted";

const projects = ['Devias', 'Acme Corp'];

const useProjectsStore = () => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: []
    });

    const handleProjectGet = useCallback(async () => {
        try {
            const response = await sectionApi.getItems();
            if (isMounted()) {
                setState({
                    items: response.items,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted]);

    useEffect(() => {
            handleProjectGet();
        },
        []);

    return {
        ...state
    };
};

export const ProjectSwitch = (props) => {
    const popover = usePopover();

    const projectsStore = useProjectsStore();

    return (
        <>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                {...props}>
                <Box sx={{flexGrow: 1}}>
                    <Typography
                        color="inherit"
                        variant="h6"
                    >
                        Mapping Workbench
                    </Typography>
                    <Typography
                        color="neutral.400"
                        variant="body2"
                    >
                        Choose a project
                    </Typography>
                </Box>
                <IconButton
                    onClick={popover.handleOpen}
                    ref={popover.anchorRef}
                >
                    <SvgIcon sx={{fontSize: 16}}>
                        <ChevronDownIcon/>
                    </SvgIcon>
                </IconButton>
            </Stack>
            <ProjectPopover
                anchorEl={popover.anchorRef.current}
                onChange={popover.handleClose}
                onClose={popover.handleClose}
                open={popover.open}
                projects={projectsStore.items}
            />
        </>
    );
};

ProjectSwitch.propTypes = {
    sx: PropTypes.object
};
