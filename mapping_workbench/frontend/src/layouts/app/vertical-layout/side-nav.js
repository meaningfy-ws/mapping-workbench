import {useMemo} from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import {useTheme} from '@mui/material/styles';

import {paths} from 'src/paths';
import {Logo} from 'src/components/logo';
import {RouterLink} from 'src/components/router-link';
import {Scrollbar} from 'src/components/scrollbar';
import {usePathname} from 'src/hooks/use-pathname';
import {SideNavSection} from './side-nav-section';
import {ProjectSwitch} from "../project-switch2";
import {AppTitle} from "../../../components/app-title";
import {useProjects} from "../../../hooks/use-projects";
import {VersionLabel} from "../version-label";

const SIDE_NAV_WIDTH = 280;
const SIDE_NAV_WIDTH_SMALL = 88;

const useCssVars = (color) => {
    const theme = useTheme();

    return useMemo(() => {
        switch (color) {
            case 'blend-in':
                if (theme.palette.mode === 'dark') {
                    return {
                        '--nav-bg': theme.palette.background.default,
                        '--nav-color': theme.palette.neutral[100],
                        '--nav-border-color': theme.palette.neutral[700],
                        '--nav-logo-border': theme.palette.neutral[700],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.neutral[400],
                        '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
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
                        '--nav-bg': '#FFF',
                        '--nav-color': theme.palette.text.primary,
                        '--nav-border-color': theme.palette.neutral[100],
                        '--nav-logo-border': theme.palette.neutral[100],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.text.secondary,
                        '--nav-item-hover-bg': theme.palette.action.hover,
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

            case 'discrete':
                if (theme.palette.mode === 'dark') {
                    return {
                        '--nav-bg': theme.palette.neutral[900],
                        '--nav-color': theme.palette.neutral[100],
                        '--nav-border-color': theme.palette.neutral[700],
                        '--nav-logo-border': theme.palette.neutral[700],
                        '--nav-section-title-color': theme.palette.neutral[400],
                        '--nav-item-color': theme.palette.neutral[400],
                        '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
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
                        '--nav-bg': theme.palette.neutral[100],
                        '--nav-color': theme.palette.text.primary,
                        '--nav-border-color': theme.palette.divider,
                        '--nav-logo-border': theme.palette.neutral[200],
                        '--nav-section-title-color': theme.palette.neutral[500],
                        '--nav-item-color': theme.palette.neutral[500],
                        '--nav-item-hover-bg': theme.palette.action.hover,
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
                        '--nav-border-color': 'transparent',
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
                        '--nav-border-color': 'transparent',
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

export const SideNav = (props) => {
    const {color = 'evident', sections = [], small} = props;
    const pathname = usePathname();
    const cssVars = useCssVars(color);
    const projects = useProjects()

    const {dashboard, ...menus} = sections

    return (
        <Drawer
            anchor="left"
            open
            PaperProps={{
                sx: {
                    ...cssVars,
                    backgroundColor: 'var(--nav-bg)',
                    color: 'var(--nav-color)',
                    width: small ? SIDE_NAV_WIDTH_SMALL : SIDE_NAV_WIDTH,
                    borderRight: '1px solid var(--nav-border-color)'
                }
            }}
            variant="permanent"
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
                        {!small && <AppTitle/>}
                    </Stack>
                    <Stack
                        component="nav"
                        spacing={2}
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <Stack
                            component="nav"
                            spacing={0.5}
                            sx={{
                                m: 0,
                                p: 0
                            }}>
                            <ProjectSwitch small={small}/>
                        </Stack>
                        <Divider color='#F2F4F7'
                                 sx={{borderBottomWidth: 2}}/>
                        {dashboard.map((section, index) => (
                            <SideNavSection items={section.items}
                                            key={index}
                                            pathname={pathname}
                                            subheader={section.subheader}
                                            small={small}
                            />
                        ))}
                        {projects.sessionProject && Object.values(menus).map(menu => menu.map((section, index) => (
                            <SideNavSection
                                items={section.items}
                                key={index}
                                pathname={pathname}
                                subheader={section.subheader}
                                small={small}
                            />
                        )))}
                    </Stack>
                    <VersionLabel/>
                </Stack>
            </Scrollbar>
        </Drawer>
    );
};

SideNav.propTypes = {
    color: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
    sections: PropTypes.object
};
