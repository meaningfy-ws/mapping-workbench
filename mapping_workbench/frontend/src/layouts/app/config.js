import {useTranslation} from 'react-i18next';
import SvgIcon from '@mui/material/SvgIcon';

import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HiveIcon from '@mui/icons-material/Hive';
import MapIcon from '@mui/icons-material/Map';
import SchemaIcon from '@mui/icons-material/Schema';
import TaskIcon from '@mui/icons-material/TaskAlt';

import HomeSmileIcon from 'src/icons/ui/duocolor/home-smile';
import LayoutAlt02 from 'src/icons/ui/duocolor/layout-alt-02';
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
                    },
                    {
                        title: t(tokens.nav.import),
                        path: paths.app.mapping_packages.import
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
                        title: t(tokens.nav.generic_triple_map_fragments),
                        path: paths.app.generic_triple_map_fragments.index
                    },
                    {
                        title: t(tokens.nav.specific_triple_map_fragments),
                        path: paths.app.specific_triple_map_fragments.index
                    }
                ]
            },
            {
                title: t(tokens.nav.fields_registry),
                path: paths.app.fields_registry.elements.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <HiveIcon/>
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.elements),
                        path: paths.app.fields_registry.elements.index
                    },
                    {
                        title: t(tokens.nav.import),
                        path: paths.app.fields_registry.elements.import
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
                    title: t(tokens.nav.ontology),
                    path: paths.app.ontology_namespaces.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <SchemaIcon/>
                        </SvgIcon>
                    ),
                    items: [
                        {
                            title: t(tokens.nav.namespaces),
                            path: paths.app.ontology_namespaces.index
                        },
                        {
                            title: t(tokens.nav.terms),
                            path: paths.app.ontology_terms.index
                        }
                    ]
                },
                {
                    title: t(tokens.nav.tasks),
                    path: paths.app.tasks.index,
                    icon: (
                        <SvgIcon fontSize="small">
                            <TaskIcon/>
                        </SvgIcon>
                    ),
                    items: [
                        {
                            title: t(tokens.nav.terms_validator),
                            path: paths.app.tasks.terms_validator
                        },
                        {
                            title: t(tokens.nav.assertions_queries),
                            path: paths.app.tasks.generate_cm_assertions_queries
                        },
                        {
                            title: t(tokens.nav.transform_test_data),
                            path: paths.app.tasks.transform_test_data
                        }
                    ]
                },
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
