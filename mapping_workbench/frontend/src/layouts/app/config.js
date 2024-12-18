import {useTranslation} from 'react-i18next';

import DvrIcon from '@mui/icons-material/Dvr';
import ArchiveIcon from '@mui/icons-material/Archive';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import HomeSmileIcon from 'src/icons/ui/duocolor/home-smile';

import ApiIcon from '@mui/icons-material/Api';
import SvgIcon from '@mui/material/SvgIcon';

import {paths} from 'src/paths';
import {tokens} from 'src/locales/tokens';

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
        sourceAndTarget: [
            {
                items: [{
                    title: t(tokens.nav.source_and_target),
                    path: paths.app.test_data_suites.index,
                    icon: (<ModeStandbyIcon fontSize='small'/>)
                }]
            }
        ],
        elementsDefinition: [{
            items: [{
                title: t(tokens.nav.elements_definition),
                path: paths.app.fields_and_nodes.develop.index,
                icon: (<ApiIcon fontSize="small"/>),
            }]
        }],
        conceptualMappings: [{
            items: [{
                title: t(tokens.nav.conceptual_mappings),
                path: paths.app.conceptual_mapping_rules.develop.index,
                icon: (<LightbulbCircleIcon fontSize="small"/>),
            }]
        }],
        technical_mappings: [{
            items: [{
                title: t(tokens.nav.technical_mappings),
                path: paths.app.triple_map_fragments.index,
                icon: (<DvrIcon fontSize="small"/>),
            }]
        }],
        quality_control: [{
            items: [{
                title: t(tokens.nav.quality_control),
                path: paths.app.sparql_test_suites.index,
                icon: (<VerifiedIcon fontSize="small"/>),
            }]
        }],
        mappingPackages: [
            {
                items: [
                    {
                        title: t(tokens.nav.mapping_packages),
                        path: paths.app.mapping_packages.index,
                        icon: (<ArchiveIcon fontSize="small"/>),
                    }]
            }
        ],
        processMonitor: [{
            items: [
                {
                    title: t(tokens.nav.process_monitor),
                    path: paths.app.tasks.index,
                    icon: (<TaskAltIcon fontSize="small"/>)
                }]
        }],
    };
}
