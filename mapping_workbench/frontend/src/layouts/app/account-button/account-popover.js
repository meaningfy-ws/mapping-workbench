import PropTypes from 'prop-types';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import {LogOut01 as LogOutIcon} from '@untitled-ui/icons-react/build/esm';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DemoConfigIcon from '@mui/icons-material/Tune';

import {RouterLink} from 'src/components/router-link';
import {useAuth} from 'src/hooks/use-auth';
import {useRouter} from 'src/hooks/use-router';
import {paths} from 'src/paths';
import {Issuer} from 'src/utils/auth';
import {toastError, toastLoad} from "../../../components/app-toast";
import {sessionApi} from "../../../api/session";
import {securityApi} from "../../../api/security";

export const AccountPopover = (props) => {
    const {anchorEl, onClose, open, ...other} = props;
    const router = useRouter();
    const auth = useAuth();

    const handleLogout = async () => {
        try {
            onClose?.();

            switch (auth.issuer) {
                case Issuer.DEFAULT: {
                    toastLoad("Logging out...");
                    await auth.signOut();
                    break;
                }

                default: {
                    console.warn('Using an unknown Auth Issuer, did not log out');
                }
            }
            router.reload();
        } catch (err) {
            console.error(err);
            toastError(err);
        }
    }

    const project = sessionApi.getSessionProject()
    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}
            disableScrollLock
            onClose={onClose}
            open={!!open}
            PaperProps={{sx: {width: 200}}}
            {...other}>
            <Box sx={{p: 2}}>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    {auth.user?.email}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{p: 1}}>
                <ListItemButton
                    disabled
                    component={RouterLink}
                    href={paths.app.account}
                    onClick={onClose}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <User03Icon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                        primary={(
                            <Typography variant="body1">
                                Profile
                            </Typography>
                        )}
                    />
                </ListItemButton>
                {project && <ListItemButton
                    id='project_setup_button'
                    component={RouterLink}
                    href={paths.app.projects.edit.replace('[id]', project)}
                    onClick={onClose}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <Settings04Icon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                        primary={(
                            <Typography variant="body1">
                                Project Setup
                            </Typography>
                        )}
                    />
                </ListItemButton>}
                {securityApi.isUserAdmin(auth.user) && <ListItemButton
                    id='authorization_button'
                    component={RouterLink}
                    href={paths.app.authorization.index}
                    onClick={onClose}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <ManageAccountsIcon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                        primary={(
                            <Typography variant="body1">
                                Authorization
                            </Typography>
                        )}
                    />
                </ListItemButton>}
                {securityApi.isUserAdmin(auth.user) && <ListItemButton
                    id='authorization_button'
                    component={RouterLink}
                    href={paths.app.demoConfig.index}
                    onClick={onClose}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <DemoConfigIcon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                        primary={(
                            <Typography variant="body1">
                                Demo Config
                            </Typography>
                        )}
                    />
                </ListItemButton>}
            </Box>
            <Divider sx={{my: '0 !important'}}/>
            <Box
                sx={{
                    display: 'flex',
                    p: 1,
                    justifyContent: 'center'
                }}
            >
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <LogOutIcon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                        primary={(
                            <Typography variant="body1">
                                Logout
                            </Typography>
                        )}
                    />
                </ListItemButton>
            </Box>
        </Popover>
    );
};

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
};
