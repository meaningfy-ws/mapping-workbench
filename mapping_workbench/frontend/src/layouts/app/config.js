import {useTranslation} from 'react-i18next';

import SvgIcon from '@mui/material/SvgIcon';

import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import HiveIcon from '@mui/icons-material/Hive';
import SchemaIcon from '@mui/icons-material/Schema';
import TaskIcon from '@mui/icons-material/TaskAlt';
import TopicIcon from '@mui/icons-material/Topic';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TocIcon from '@mui/icons-material/Toc';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ApiIcon from '@mui/icons-material/Api';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import DvrIcon from '@mui/icons-material/Dvr';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArchiveIcon from '@mui/icons-material/Archive';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

import HomeSmileIcon from 'src/icons/ui/duocolor/home-smile';
import {tokens} from 'src/locales/tokens';
import {paths} from 'src/paths';


export const useSections = () => {
    const {t} = useTranslation();
    return {
        overview: [
            {
                items: [{
                    title: t(tokens.nav.overview),
                    path: paths.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <HomeSmileIcon/>
                        </SvgIcon>
                    )
                }
                ]
            }],
        projectSetup: [
            {
                items: [
                    {
                        title: t(tokens.nav.project_setup),
                        icon: (
                            <SvgIcon fontSize="small">
                                <SettingsApplicationsIcon/>
                            </SvgIcon>
                        ),
                        items: [
                            {
                                title: t(tokens.nav.ontology_files),
                                path: paths.app.ontology_files.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <NewspaperIcon/>
                                    </SvgIcon>
                                )
                            },
                            {
                                title: t(tokens.nav.ontology_terms),
                                path: paths.app.ontology_terms.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <SchemaIcon/>
                                    </SvgIcon>
                                )
                            },
                            {
                                title: t(tokens.nav.test_data_suites),
                                path: paths.app.test_data_suites.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <BiotechIcon/>
                                    </SvgIcon>
                                )
                            },
                        ],
                    }]
            }
        ],
        fieldsAndNodes: [{
            items: [
                {
                    title: t(tokens.nav.fields_and_nodes),
                    icon: (
                        <SvgIcon fontSize="small">
                            <ApiIcon/>
                        </SvgIcon>
                    ),
                    items: [
                        {
                            title: t(tokens.nav.fields_develop),
                            path: paths.app.fields_and_nodes.develop.index,
                            icon: (
                                <SvgIcon>
                                    <TocIcon/>
                                </SvgIcon>
                            )
                        },
                        {
                            title: t(tokens.nav.fields_overview),
                            path: paths.app.fields_and_nodes.overview.index,
                            icon: (
                                <SvgIcon fontSize="small">
                                    <MenuOpenIcon/>
                                </SvgIcon>
                            )
                        },
                        {
                            title: t(tokens.nav.tree_view),
                            path: paths.app.fields_and_nodes.tree_view.index,
                            icon: (
                                <SvgIcon fontSize="small">
                                    <TopicIcon/>
                                </SvgIcon>
                            )
                        },


                    ]
                }]
        }],
        conceptualMappings: [
            {
                items: [
                    {
                        title: t(tokens.nav.conceptual_mappings),
                        icon: (
                            <SvgIcon fontSize="small">
                                <LightbulbCircleIcon/>
                            </SvgIcon>
                        ),
                        items: [
                            {
                                title: t(tokens.nav.develop_cm),
                                path: paths.app.conceptual_mapping_rules.develop.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <AnnouncementIcon/>
                                    </SvgIcon>
                                )
                            },
                            {
                                title: t(tokens.nav.review_cm),
                                path: paths.app.conceptual_mapping_rules.review.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <RateReviewIcon/>
                                    </SvgIcon>
                                )
                            },
                            {
                                title: t(tokens.nav.content_cm),
                                path: paths.app.conceptual_mapping_rules.overview.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <ReviewsIcon/>
                                    </SvgIcon>
                                )
                            },
                            {
                                title: t(tokens.nav.detailed_view_cm),
                                path: paths.app.conceptual_mapping_rules.groups.index,
                                icon: (
                                    <SvgIcon fontSize="small">
                                        <SpeakerNotesIcon/>
                                    </SvgIcon>
                                )
                            }
                        ]
                    }]
            }
        ],
        technicalMappings: [{
            items: [
                {
                    title: t(tokens.nav.technical_mappings),
                    icon: (
                        <SvgIcon fontSize="small">
                            <DvrIcon/>
                        </SvgIcon>
                    ),
                    items: [
                        {
                            title: t(tokens.nav.value_mapping_resources),
                            path: paths.app.value_mapping_resources.index,
                            icon: (
                                <SvgIcon fontSize='small'>
                                    <HubIcon/>
                                </SvgIcon>
                            )
                        },
                        {
                            title: t(tokens.nav.triple_map_fragments),
                            path: paths.app.triple_map_fragments.index,
                            icon: (
                                <SvgIcon fontSize='small'>
                                    <HiveIcon/>
                                </SvgIcon>
                            )
                        },
                    ]
                }]
        }],
        qualityControl: [{
            items: [
                {
                    title: t(tokens.nav.quality_control),
                    icon: (
                        <SvgIcon fontSize='small'>
                            <VerifiedIcon/>
                        </SvgIcon>
                    ),
                    items: [
                        {
                            title: t(tokens.nav.sparql_test_suites),
                            path: paths.app.sparql_test_suites.index,
                            icon: (
                                <SvgIcon fontSize="small">
                                    <FlareIcon/>d
                                </SvgIcon>
                            )
                        },
                        {
                            title: t(tokens.nav.shacl_test_suites),
                            path: paths.app.shacl_test_suites.index,
                            icon: (
                                <SvgIcon fontSize="small">
                                    <ContentCutIcon/>
                                </SvgIcon>
                            )
                        },

                    ]
                }]
        }],
        mappingPackages: [{
            items: [
                {
                    icon: (
                        <SvgIcon fontSize="small">
                            <ArchiveIcon/>
                        </SvgIcon>
                    ),
                    title: t(tokens.nav.mapping_packages),
                    path: paths.app.mapping_packages.index
                },
            ]
        }],
        activities: [{
            items: [
                {
                    title: t(tokens.nav.activities),
                    path: paths.app.tasks.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <TaskIcon/>
                        </SvgIcon>
                    )
                }]
        }]
    };
}
