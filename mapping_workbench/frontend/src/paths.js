export const paths = {
    index: '/',
    auth: {
        jwt: {
            login: '/auth/jwt/login',
            register: '/auth/jwt/register'
        },
        auth0: {
            login: '/auth/auth0/login'
        },
        google: {
            authorize: '/auth/google/authorize',
            callback: '/auth/google/callback'
        }
    },
    app: {
        index: '/app',
        projects: {
            index: '/app/projects',
            create: '/app/projects/create',
            edit: '/app/projects/[id]/edit',
            view: '/app/projects/[id]/view'
        },
        test_data_suites: {
            index: '/app/test-data-suites',
            create: '/app/test-data-suites/create',
            edit: '/app/test-data-suites/[id]/edit',
            view: '/app/test-data-suites/[id]/view',
            resource_manager: {
                index: '/app/test-data-suites/[id]/resource-manager',
                create: '/app/test-data-suites/[id]/resource-manager/create',
                edit: '/app/test-data-suites/[id]/resource-manager/[fid]/edit',
                view: '/app/test-data-suites/[id]/resource-manager/[fid]/view',
            },
            tasks: {
                transform_test_data: '/app/test-data-suites/tasks/transform-test-data'
            }
        },
        sparql_test_suites: {
            index: '/app/sparql-test-suites',
            create: '/app/sparql-test-suites/create',
            edit: '/app/sparql-test-suites/[id]/edit',
            view: '/app/sparql-test-suites/[id]/view',
            resource_manager: {
                index: '/app/sparql-test-suites/[id]/resource-manager',
                create: '/app/sparql-test-suites/[id]/resource-manager/create',
                edit: '/app/sparql-test-suites/[id]/resource-manager/[fid]/edit',
                view: '/app/sparql-test-suites/[id]/resource-manager/[fid]/view',
            }
        },
        shacl_test_suites: {
            index: '/app/shacl-test-suites',
            create: '/app/shacl-test-suites/create',
            edit: '/app/shacl-test-suites/[id]/edit',
            view: '/app/shacl-test-suites/[id]/view',
            resource_manager: {
                index: '/app/shacl-test-suites/[id]/resource-manager',
                create: '/app/shacl-test-suites/[id]/resource-manager/create',
                edit: '/app/shacl-test-suites/[id]/resource-manager/[fid]/edit',
                view: '/app/shacl-test-suites/[id]/resource-manager/[fid]/view',
            }
        },
        ontology: {
            index: '/app/ontology',
            create: '/app/ontology/create',
            edit: '/app/ontology/[id]/edit',
        },
        // schema: {
        //     index: '/app/schema',
        //     import: '/app/schema/import',
        //     elements: {
        //         view: (id) => `/app/schema/${id}/view`,
        //     }
        // },
        schema_files: {
            index: '/app/schema-files'
        },
        fields_overview: {
            index: '/app/fields-overview',
            import: '/app/fields-overview/import',
            elements: {
                view: (id) => `/app/fields-overview/${id}/view`,
            }
        },
        ontology_files: {
            index: '/app/ontology-files'
        },
        value_mapping_resources: {
            index: '/app/value-mapping-resources',
            create: '/app/value-mapping-resources/create',
            edit: '/app/value-mapping-resources/[id]/edit',
            view: '/app/value-mapping-resources/[id]/view',
            resource_manager: {
                index: '/app/value-mapping-resources/[id]/resource-manager',
                create: '/app/value-mapping-resources/[id]/resource-manager/create',
                edit: '/app/value-mapping-resources/[id]/resource-manager/[fid]/edit',
                view: '/app/value-mapping-resources/[id]/resource-manager/[fid]/view',
            }
        },
        mapping_packages: {
            index: '/app/mapping-packages',
            create: '/app/mapping-packages/create',
            edit: '/app/mapping-packages/[id]/edit',
            view: '/app/mapping-packages/[id]/view',
            import: '/app/mapping-packages/import',
            states: {
                index: '/app/mapping-packages/[pid]/states',
                view: (pid, id) => `/app/mapping-packages/${pid}/states/${id}/view`,
            }
        },

        detailed_view_cm: {
            index: '/app/detailed-view-cm'
        },
        conceptual_mapping_rules: {
            index: '/app/conceptual-mapping-rules',
            edit: '/app/conceptual-mapping-rules/[id]/edit',
            view: '/app/conceptual-mapping-rules/[id]/view',
            tasks: {
                generate_cm_assertions_queries: '/app/conceptual-mapping-rules/tasks/generate-cm-assertions-queries'
            },
            develop: {
                index: '/app/conceptual-mapping-rules/develop'
            },
            review: {
                index: '/app/conceptual-mapping-rules/review'
            },
            overview: {
                index: '/app/conceptual-mapping-rules/overview',
                create: '/app/conceptual-mapping-rules/overview/create',
            },
            groups: {
                index: '/app/conceptual-mapping-rules/groups'
            }
        },

        triple_map_fragments: {
            index: '/app/triple-map-fragments',
            create: '/app/triple-map-fragments/create',
            edit: '/app/triple-map-fragments/[id]/edit',
            view: '/app/triple-map-fragments/[id]/view'
        },

        generic_triple_map_fragments: {
            index: '/app/triple-map-fragments',
            create: '/app/triple-map-fragments/create',
            edit: '/app/triple-map-fragments/[id]/edit',
            view: '/app/triple-map-fragments/[id]/view'
        },

        specific_triple_map_fragments: {
            index: '/app/triple-map-fragments',
            create: '/app/triple-map-fragments/create',
            edit: '/app/triple-map-fragments/[id]/edit',
            view: '/app/triple-map-fragments/[id]/view'
        },

        users: {
            index: '/app/users',
            edit: '/app/users/[id]/edit',
            view: '/app/users/[id]/view'
        },
        customers: {
            index: '/app/customers',
            details: '/app/customers/:customerId',
            edit: '/app/customers/:customerId/edit',
        },
        account: '/app/account',

        ontology_namespaces_custom: {
            index: '/app/ontology-namespaces-custom',
            create: '/app/ontology-namespaces-custom/create',
            edit: '/app/ontology-namespaces-custom/[id]/edit'
        },
        ontology_namespaces: {
            index: '/app/ontology-namespaces',
            create: '/app/ontology-namespaces/create',
            edit: '/app/ontology-namespaces/[id]/edit',
            view: '/app/ontology-namespaces/[id]/view'
        },
        ontology_terms: {
            index: '/app/ontology-terms',
            create: '/app/ontology-terms/create',
            edit: '/app/ontology-terms/[id]/edit',
            view: '/app/ontology-terms/[id]/view'
        },
        fields_registry: {
            elements: {
                index: '/app/fields-registry/elements',
                //create: '/app/fields-registry/elements/create',
                //edit: '/app/fields-registry/elements/[id]/edit',
                view: (id) => `/app/fields-registry/elements/${id}/view`,
                import: '/app/fields-registry/elements/import',
                tree_view: {
                    index: '/app/fields-registry/tree-view'
                },
            }
        },
        fields_and_nodes: {
            tree_view: {
                index: '/app/fields-and-nodes/tree-view'
            },
            develop: {
                index: '/app/fields-and-nodes/develop',
                id: (id) => `/app/fields-and-nodes/develop/${id}`
            },
            overview: {
                index: '/app/fields-and-nodes/overview',
                import: '/app/fields-and-nodes/overview/import',
                elements: {
                    create: `/app/fields-and-nodes/overview/create`,
                    edit: (id) => `/app/fields-and-nodes/overview/${id}/edit`,
                    view: (id) => `/app/fields-and-nodes/overview/${id}/view`,
                }
            }
        },
        fields_tree: {
            index: '/app/fields-tree'
        },
        tasks: {
            index: '/app/tasks',
            terms_validator: '/app/tasks/terms_validator',
            transform_test_data: '/app/tasks/transform_test_data',
            generate_cm_assertions_queries: '/app/tasks/generate_cm_assertions_queries'
        },
        fluree: {
            index: '/app/fluree'
        },
        fluree_crypt: {
            index: '/app/fluree-crypt'
        },
        authorization: {
            index: '/app/authorization'
        },
        demoConfig: {
            index: '/app/demo-config'
        }
    },
    docs: 'https://material-kit-pro-react-docs.devias.io',
    notAuthorized: '/401',
    accountNotVerified: '/auth/unverified',
    notFound: '/404',
    serverError: '/500',
    underConstruction: '/under-construction'
};


export const apiPaths = {
    projects: {
        items: '/projects',
        item: '/projects/:id',
        cleanup: '/projects/:id/cleanup',
        export_source_files: '/projects/:id/export_source_files',
    },
    test_data_suites: {
        items: '/test_data_suites',
        item: '/test_data_suites/:id',
        file_resources: '/test_data_suites/:id/file_resources',
        file_resource: '/test_data_suites/file_resources/:id',
        file_history: '/test_data_suites/file_resources/:id/transform/history',
        assign_mapping_packages: '/test_data_suites/assign_mapping_packages',
        tasks: {
            transform_test_data: '/test_data_suites/tasks/transform_test_data',
            import: '/test_data_suites/tasks/import',
        },
        file_resources_struct_tree: '/test_data_suites/file_resources_struct_tree/'
    },
    sparql_test_suites: {
        items: '/sparql_test_suites',
        item: '/sparql_test_suites/:id',
        file_resources: '/sparql_test_suites/:id/file_resources',
        file_resource: '/sparql_test_suites/file_resources/:id',
        project_file_resources: '/sparql_test_suites/project/file_resources',
        assign_mapping_packages: '/sparql_test_suites/assign_mapping_packages'
    },
    shacl_test_suites: {
        items: '/shacl_test_suites',
        item: '/shacl_test_suites/:id',
        file_resources: '/shacl_test_suites/:id/file_resources',
        file_resource: '/shacl_test_suites/file_resources/:id',
        assign_mapping_packages: '/shacl_test_suites/assign_mapping_packages'
    },
    detailed_view_cm: {
        items: '/conceptual_mapping_group'
    },
    value_mapping_resources: {
        items: '/resource_collections',
        item: '/resource_collections/:id',
        file_resources: '/resource_collections/:id/file_resources',
        file_resource: '/resource_collections/file_resources/:id',
        assign_mapping_packages: '/resource_collections/assign_mapping_packages'
    },

    mapping_packages: {
        items: '/mapping_packages',
        item: '/mapping_packages/:id',
        create_default: '/mapping_packages/create_default',
        import: '/package_importer/tasks/import',
        process: '/package_processor/tasks/process',
        export: '/package_exporter/export_latest_package_state',
        export_specific: '/package_exporter/export_specific_package_state',
        states: '/mapping_packages/:id/states',
        state: '/mapping_packages/state/:id',
        validation_reports: '/package_exporter/get_validation_reports',
        latest_state: (package_id) => `/mapping_packages/${package_id}/latest_state`,
        validation_reports_tree: (sid) => `/package_validator/validation_reports_tree/state/${sid}`,
        xpath_reports: (sid) => `/package_validator/xpath/state/${sid}`,
        xpath_reports_suite: (sid, suiteId) => `/package_validator/xpath/state/${sid}/suite/${suiteId}`,
        xpath_reports_test: (sid, suiteId, testId) => `/package_validator/xpath/state/${sid}/suite/${suiteId}/test/${testId}`,
        sparql_reports: (sid) => `/package_validator/sparql/state/${sid}`,
        sparql_reports_suite: (sid, suiteId) => `/package_validator/sparql/state/${sid}/suite/${suiteId}`,
        sparql_reports_test: (sid, suiteId, testId) => `/package_validator/sparql/state/${sid}/suite/${suiteId}/test/${testId}`,
        shacl_reports: (sid) => `/package_validator/shacl/state/${sid}`,
        shacl_reports_suite: (sid, suiteId) => `/package_validator/shacl/state/${sid}/suite/${suiteId}`,
        shacl_reports_test: (sid, suiteId, testId) => `/package_validator/shacl/state/${sid}/suite/${suiteId}/test/${testId}`,

        validation_report_files: '/package_exporter/get_validation_report_files'
    },

    conceptual_mapping_rules: {
        items: '/conceptual_mapping_rules',
        item: '/conceptual_mapping_rules/:id',
        dev_cm: '/conceptual_mapping_rules/dev/:id',
        check_content_terms_validity: '/ontology/check_content_terms_validity',
        search_terms: '/ontology/search_terms',
        prefixed_terms: '/ontology/prefixed_terms',
        clone: '/conceptual_mapping_rules/:id/clone',
        statuses: '/conceptual_mapping_rules/status/list',
        mapping_notes: '/conceptual_mapping_rules/:id/mapping_notes',
        editorial_notes: '/conceptual_mapping_rules/:id/editorial_notes',
        feedback_notes: '/conceptual_mapping_rules/:id/feedback_notes',
        generate_shacl: '/conceptual_mapping_rules/generate_shacl_shapes',
        tasks: {
            generate_cm_assertions_queries: '/conceptual_mapping_rules/tasks/generate_cm_assertions_queries'
        }
    },

    triple_map_fragments: {
        items: '/triple_map_fragments',
        item: '/triple_map_fragments/:id'
    },

    generic_triple_map_fragments: {
        items: '/generic_triple_map_fragments',
        item: '/generic_triple_map_fragments/:id',
        tree: '/test_data_suites/file_resources_struct_tree',
        content: (id) => `/test_data_suites/file_resources/${id}/content`,
        transform_result_content: (id, triple_map_id) => `/test_data_suites/file_resources/${id}/transform/generic_triple_map/${triple_map_id}`
    },

    specific_triple_map_fragments: {
        items: '/specific_triple_map_fragments',
        item: '/specific_triple_map_fragments/:id',
        tree: '/test_data_suites/file_resources_struct_tree',
        content: (id) => `/test_data_suites/file_resources/${id}/content`,
        transform_result_content: (id, triple_map_id) => `/test_data_suites/file_resources/${id}/transform/specific_triple_map/${triple_map_id}`
    },

    ontology_namespaces_custom: {
        items: '/ontology/namespaces_custom',
        item: '/ontology/namespaces_custom/:id'
    },

    ontology_namespaces: {
        items: '/ontology/namespaces',
        item: '/ontology/namespaces/:id',
        create_namespaces: '/ontology/namespaces/bulk'
    },

    ontology_terms: {
        items: '/ontology/terms',
        item: '/ontology/terms/:id',
        discover_terms: '/ontology/tasks/discover_terms',
        known_terms: '/ontology/known_terms'
    },

    session: {
        session_project: '/users/set_project_for_current_user_session',
        app_settings: '/users/set_app_settings_for_current_user',
        me: '/users/me',
        user_check_verified: '/users/check/verified'
    },

    fields_registry: {
        items: '/fields_registry',
        item: '/fields_registry/:id',
        import_eforms_xsd: '/fields_registry/tasks/import_eforms_xsd',
        check_import_eforms_xsd: '/fields_registry/check_import_eforms_xsd',
        elements: '/fields_registry/elements',
        elements_tree: '/fields_registry/elements_tree',
        element: '/fields_registry/elements/:id',
    },

    fields_overview: {
        items: '/fields_registry/elements',
        create: '/fields_registry/elements/create',
        item: '/fields_registry/elements/:id',
        import_eforms_xsd: '/fields_registry/tasks/import_eforms_xsd',
        element: '/fields_registry/elements/:id',
    },

    schema_files: {
        items: '/xsd_schema/xsd_files',
        item: (name, id) => `/xsd_schema/xsd_files/${name}?project_id=${id}`,
        addFile: (id) => `/xsd_schema/xsd_files?project_id=${id}`,
        deleteFile: (name, id) => `/xsd_schema/xsd_files/${name}?project_id=${id}`
    },
    ontology_files: {
        items: '/ontology/ontology_files',
        item: (name, id) => `/ontology/ontology_files/${name}?project_id=${id}`,
        addFile: (id) => `/ontology/ontology_files?project_id=${id}`,
        deleteFile: (name, id) => `/ontology/ontology_files/${name}?project_id=${id}`
    },

    users: {
        items: '/users',
        item: '/users/:id',
        roles: '/users/roles/values',
        authorize: '/users/authorize',
        unauthorize: '/users/unauthorize',
        update_roles: '/users/update_roles'

    },

    tasks: {
        items: '/task_manager',
        task_cancel: (task_id) => `/task_manager/cancel/${task_id}`,
        task_delete: (task_id) => `/task_manager/delete/${task_id}`,
        task_delete_all: '/task_manager/delete_all',
        terms_validator: '/tasks/terms_validator',
        generate_cm_assertions_queries: '/tasks/generate_cm_assertions_queries',
        transform_test_data: '/tasks/transform_test_data'
    },
    demoConfig: {
        reset: "/demo/reset"
    },
    app: {
        settings: '/app/settings'
    }
}