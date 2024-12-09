import {useTranslation} from 'react-i18next';

import SvgIcon from '@mui/material/SvgIcon';

import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ApiIcon from '@mui/icons-material/Api';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import DvrIcon from '@mui/icons-material/Dvr';

import HomeSmileIcon from 'src/icons/ui/duocolor/home-smile';
import {tokens} from 'src/locales/tokens';
import {paths} from 'src/paths';


export const useSections = () => {
    const {t} = useTranslation();
    return {
        dashboard: [
            {
                items: [{
                    title: t(tokens.nav.dashboard),
                    path: paths.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <HomeSmileIcon/>
                        </SvgIcon>
                    )
                }
                ]
            }],
        mappingProcess: [
            {
                items: [{
                    title: t(tokens.nav.mapping_process),
                    path: paths.app.test_data_suites.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <SettingsApplicationsIcon/>
                        </SvgIcon>
                    )
                }]
            }
        ],
        projectFiles: [{
            items: [{
                title: t(tokens.nav.project_files),
                path: paths.app.fields_and_nodes.develop.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <ApiIcon/>
                    </SvgIcon>
                ),
            }]
        }],
        mappingPackages: [
            {
                items: [
                    {
                        title: t(tokens.nav.mapping_packages),
                        path: paths.app.mapping_packages.index,
                        icon: (
                            <SvgIcon fontSize="small">
                                <LightbulbCircleIcon/>
                            </SvgIcon>
                        ),
                    }]
            }
        ],
        processMonitor: [{
            items: [
                {
                    title: t(tokens.nav.process_monitor),
                    path: paths.app.tasks.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <DvrIcon/>
                        </SvgIcon>
                    )
                }]
        }],
    };
}
