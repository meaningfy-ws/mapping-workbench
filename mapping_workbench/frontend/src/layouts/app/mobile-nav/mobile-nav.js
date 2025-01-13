import {useMemo} from 'react';
import PropTypes from 'prop-types';

import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import {useTheme} from '@mui/material/styles';

import {paths} from 'src/paths';
import {Logo} from 'src/components/logo';
import {AppTitle} from 'src/components/app-title';
import {RouterLink} from 'src/components/router-link';
import {Scrollbar} from 'src/components/scrollbar';
import {usePathname} from 'src/hooks/use-pathname';
import {useProjects} from "src/hooks/use-projects";
import {MobileNavSection} from './mobile-nav-section';
import {ProjectSwitch} from "../project-switch2";
import {VersionLabel} from "../version-label";

const MOBILE_NAV_WIDTH = 280;

const useCssVars = (color) => {
    const theme = useTheme();

    return useMemo(() => {
        switch (color) {
            // Blend-in and discrete have no difference on mobile because
            // there's a backdrop and differences are not visible
            case 'blend-in':
            case 'discrete':
                if (theme.palette.mode === 'dark') {
                    return {
                        '--nav-bg': theme.palette.background.default,
                        '--nav-color': theme.palette.neutral[100],
                        '--nav-logo-border': theme.palette.neutral[700],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.neutral[400],
                        '--nav-item-hover-bg': theme.palette.primary.dark,
                        '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
                        '--nav-item-active-color': theme.palette.text.primary,
                        '--nav-item-disabled-color': theme.palette.neutral[600],
                        '--nav-item-icon-color': theme.palette.neutral[500],
                        '--nav-item-icon-active-color': theme.palette.primary.main,
                        '--nav-item-icon-disabled-color': theme.palette.neutral[700],
                        '--nav-item-chevron-color': theme.palette.neutral[700],
                        '--nav-scrollbar-color': theme.palette.neutral[400]
                    };
                } else {
                    return {
                        '--nav-bg': theme.palette.background.paper,
                        '--nav-color': theme.palette.text.primary,
                        '--nav-logo-border': theme.palette.neutral[100],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.text.secondary,
                        '--nav-item-hover-bg': theme.palette.primary.light,
                        '--nav-item-active-bg': theme.palette.action.selected,
                        '--nav-item-active-color': theme.palette.text.primary,
                        '--nav-item-disabled-color': theme.palette.neutral[400],
                        '--nav-item-icon-color': theme.palette.neutral[400],
                        '--nav-item-icon-active-color': theme.palette.primary.main,
                        '--nav-item-icon-disabled-color': theme.palette.neutral[400],
                        '--nav-item-chevron-color': theme.palette.neutral[400],
                        '--nav-scrollbar-color': theme.palette.neutral[900]
                    };
                }

            case 'evident':
                if (theme.palette.mode === 'dark') {
                    return {
                        '--nav-bg': theme.palette.neutral[800],
                        '--nav-color': theme.palette.common.white,
                        '--nav-logo-border': theme.palette.neutral[700],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.neutral[400],
                        '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
                        '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
                        '--nav-item-active-color': theme.palette.common.white,
                        '--nav-item-disabled-color': theme.palette.neutral[500],
                        '--nav-item-icon-color': theme.palette.neutral[400],
                        '--nav-item-icon-active-color': theme.palette.primary.main,
                        '--nav-item-icon-disabled-color': theme.palette.neutral[500],
                        '--nav-item-chevron-color': theme.palette.neutral[600],
                        '--nav-scrollbar-color': theme.palette.neutral[400]
                    };
                } else {
                    return {
                        '--nav-bg': theme.palette.neutral[800],
                        '--nav-color': theme.palette.common.white,
                        '--nav-logo-border': theme.palette.neutral[700],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.neutral[400],
                        '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
                        '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
                        '--nav-item-active-color': theme.palette.common.white,
                        '--nav-item-disabled-color': theme.palette.neutral[500],
                        '--nav-item-icon-color': theme.palette.neutral[400],
                        '--nav-item-icon-active-color': theme.palette.primary.main,
                        '--nav-item-icon-disabled-color': theme.palette.neutral[500],
                        '--nav-item-chevron-color': theme.palette.neutral[600],
                        '--nav-scrollbar-color': theme.palette.neutral[400]
                    };
                }

            default:
                return {};
        }
    }, [theme, color]);
};

export const MobileNav = (props) => {
    const {color = 'evident', open, onClose, sections = []} = props;
    const pathname = usePathname();
    const cssVars = useCssVars(color);
    const projects = useProjects()

    const {dashboard, ...menus} = sections

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    ...cssVars,
                    backgroundColor: 'var(--nav-bg)',
                    color: 'var(--nav-color)',
                    width: MOBILE_NAV_WIDTH
                }
            }}
            variant="temporary"
        >
            <Scrollbar
                sx={{
                    height: '100%',
                    '& .simplebar-content': {
                        height: '100%'
                    },
                    '& .simplebar-scrollbar:before': {
                        background: 'var(--nav-scrollbar-color)'
                    }
                }}
            >
                <Stack sx={{height: '100%'}}>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={'14px'}
                        sx={{px: '20px', py: '25px'}}
                    >
                        <Box
                            component={RouterLink}
                            href={paths.index}
                            sx={{
                                display: 'flex',
                                height: 40,
                                width: 40
                            }}
                        >
                            <Logo/>
                        </Box>
                        <AppTitle/>
                    </Stack>
                    <Stack
                        component="nav"
                        spacing={2}
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <Stack
                            component="ul"
                            spacing={0.5}
                            sx={{
                                listStyle: 'none',
                                m: 0,
                                p: 0
                            }}>
                            <ProjectSwitch/>
                        </Stack>
                        <Divider color='#F2F4F7'
                                 sx={{borderBottomWidth: 2}}/>
                        {dashboard.map((section, index) => (
                            <MobileNavSection items={section.items}
                                              key={index}
                                              pathname={pathname}
                                              subheader={section.subheader}
                            />
                        ))}
                        {projects.sessionProject && Object.values(menus).map(menu => menu.map((section, index) => (
                            <MobileNavSection items={section.items}
                                              key={index}
                                              pathname={pathname}
                                              subheader={section.subheader}
                            />
                        )))}

                    </Stack>
                    <VersionLabel/>
                </Stack>
            </Scrollbar>
        </Drawer>
    );
};

MobileNav.propTypes = {
    color: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    sections: PropTypes.object
};
