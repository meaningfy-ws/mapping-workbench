import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import SvgIcon from '@mui/material/SvgIcon';
import BarChartSquare02Icon from 'src/icons/ui/duocolor/bar-chart-square-02';

import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HiveIcon from '@mui/icons-material/Hive';
import MapIcon from '@mui/icons-material/Map';
import SchemaIcon from '@mui/icons-material/Schema';
import FilePresentIcon from '@mui/icons-material/FilePresent';

import HomeSmileIcon from 'src/icons/ui/duocolor/home-smile';
import LayoutAlt02 from 'src/icons/ui/duocolor/layout-alt-02';
import Upload04Icon from 'src/icons/ui/duocolor/upload-04';
import Users03Icon from 'src/icons/ui/duocolor/users-03';
import {tokens} from 'src/locales/tokens';
import {paths} from 'src/paths';
import {sessionApi} from "../../api/session";


export const useSections = () => {
    const {t} = useTranslation();
    let items = {
        projects: [],
        resources: [],
        admin: []
    };
    items.projects.push({
        items: [{
            title: t(tokens.nav.projects),
            path: paths.app.projects.index,
            icon: (
                <SvgIcon fontSize="small">
                    <LayoutAlt02/>
                </SvgIcon>
            ),
            items: [
                {
                    title: t(tokens.nav.list),
                    path: paths.app.projects.index
                },
                {
                    title: t(tokens.nav.create),
                    path: paths.app.projects.create
                }
            ]
        }]
    });
    items.resources.push({
        items: [
            {
                title: t(tokens.nav.overview),
                path: paths.app.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <HomeSmileIcon/>
                    </SvgIcon>
                )
            }
        ]
    });

    let sections = {
        subheader: t(tokens.nav.resources),
        items: []
    };

    let sessionProject = sessionApi.getSessionProject();
    if (sessionProject && sessionProject !== 'null') {
        sections.items.push(
            {
                title: t(tokens.nav.test_data_suites),
                path: paths.app.test_data_suites.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <BiotechIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.test_data_suites.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.test_data_suites.create
                    }
                ]
            },
            {
                title: t(tokens.nav.sparql_test_suites),
                path: paths.app.sparql_test_suites.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <FlareIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.sparql_test_suites.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.sparql_test_suites.create
                    }
                ]
            },
            {
                title: t(tokens.nav.shacl_test_suites),
                path: paths.app.shacl_test_suites.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <ContentCutIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.shacl_test_suites.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.shacl_test_suites.create
                    }
                ]
            },
            {
                title: t(tokens.nav.ontology_file_collections),
                path: paths.app.ontology_file_collections.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <SchemaIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.ontology_file_collections.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.ontology_file_collections.create
                    }
                ]
            },
            {
                title: t(tokens.nav.resource_collections),
                path: paths.app.resource_collections.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <HubIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.resource_collections.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.resource_collections.create
                    }
                ]
            },

            {
                title: t(tokens.nav.mapping_packages),
                path: paths.app.mapping_packages.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <FolderOpenIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.mapping_packages.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.mapping_packages.create
                    }
                ]
            },

            {
                title: t(tokens.nav.conceptual_mapping_rules),
                path: paths.app.conceptual_mapping_rules.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <MapIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.conceptual_mapping_rules.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.conceptual_mapping_rules.create
                    }
                ]
            },

            {
                title: t(tokens.nav.triple_map_fragments),
                path: paths.app.triple_map_fragments.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <HiveIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.app.triple_map_fragments.index
                    },
                    {
                        title: t(tokens.nav.create),
                        path: paths.app.triple_map_fragments.create
                    }
                ]
            });
    }
    items.resources.push(sections);
    items.admin.push(
        {
            subheader: t(tokens.nav.admin),
            items: [
                {
                    title: t(tokens.nav.users),
                    path: paths.app.users.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <Users03Icon/>
                        </SvgIcon>
                    ),
                    items: [
                        {
                            title: t(tokens.nav.list),
                            path: paths.app.users.index
                        },
                        {
                            title: t(tokens.nav.details),
                            path: paths.app.users.details
                        },
                        {
                            title: t(tokens.nav.edit),
                            path: paths.app.users.edit
                        }
                    ]
                }
            ]
        });
    return items;
}
