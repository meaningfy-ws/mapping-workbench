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
        schema: {
            index: '/app/schema',
            import: '/app/schema/import',
            elements: {
                view: (id) => `/app/schema/${id}/view`,
            }
        },
        schema_files: {
            index: '/app/schema-files'
        },
        ontology_files: {
            index: '/app/ontology-files'
        },
        ontology_file_collections: {
            index: '/app/ontology-file-collections',
            create: '/app/ontology-file-collections/create',
            edit: '/app/ontology-file-collections/[id]/edit',
            view: '/app/ontology-file-collections/[id]/view',
            resource_manager: {
                index: '/app/ontology-file-collections/[id]/resource-manager',
                create: '/app/ontology-file-collections/[id]/resource-manager/create',
                edit: '/app/ontology-file-collections/[id]/resource-manager/[fid]/edit',
                view: '/app/ontology-file-collections/[id]/resource-manager/[fid]/view',
            }
        },
        resource_collections: {
            index: '/app/resource-collections',
            create: '/app/resource-collections/create',
            edit: '/app/resource-collections/[id]/edit',
            view: '/app/resource-collections/[id]/view',
            resource_manager: {
                index: '/app/resource-collections/[id]/resource-manager',
                create: '/app/resource-collections/[id]/resource-manager/create',
                edit: '/app/resource-collections/[id]/resource-manager/[fid]/edit',
                view: '/app/resource-collections/[id]/resource-manager/[fid]/view',
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
                view: (pid,id) => `/app/mapping-packages/${pid}/states/${id}/view`,
            }
        },

        conceptual_mapping_rules: {
            index: '/app/conceptual-mapping-rules',
            create: '/app/conceptual-mapping-rules/create',
            edit: '/app/conceptual-mapping-rules/[id]/edit',
            view: '/app/conceptual-mapping-rules/[id]/view',
            tasks: {
                generate_cm_assertions_queries: '/app/conceptual-mapping-rules/tasks/generate-cm-assertions-queries'
            }
        },

        cm_rules_list: {
            index: '/app/cm_rules_list' 
        },
        conceptual_mapping_rules_content: {
            index: '/app/conceptual-mapping-rules-content',
        },

        triple_map_fragments: {
            index: '/app/triple-map-fragments',
            create: '/app/triple-map-fragments/create',
            edit: '/app/triple-map-fragments/[id]/edit',
            view: '/app/triple-map-fragments/[id]/view'
        },

        generic_triple_map_fragments: {
            index: '/app/generic-triple-map-fragments',
            create: '/app/generic-triple-map-fragments/create',
            edit: '/app/generic-triple-map-fragments/[id]/edit',
            view: '/app/generic-triple-map-fragments/[id]/view'
        },

        specific_triple_map_fragments: {
            index: '/app/specific-triple-map-fragments',
            create: '/app/specific-triple-map-fragments/create',
            edit: '/app/specific-triple-map-fragments/[id]/edit',
            view: '/app/specific-triple-map-fragments/[id]/view'
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
        tasks: {
            index: '/app/tasks',
            terms_validator: '/app/tasks/terms_validator',
            transform_test_data: '/app/tasks/transform_test_data',
            generate_cm_assertions_queries: '/app/tasks/generate_cm_assertions_queries'
        },
        fluree: {
            index: '/app/fluree'
        }
    },
    docs: 'https://material-kit-pro-react-docs.devias.io',
    notAuthorized: '/401',
    notFound: '/404',
    serverError: '/500',
    underConstruction: '/under-construction'
};


export const apiPaths = {
    projects: {
        items: '/projects',
        item: '/projects/:id'
    },
    test_data_suites: {
        items: '/test_data_suites',
        item: '/test_data_suites/:id',
        file_resources: '/test_data_suites/:id/file_resources',
        file_resource: '/test_data_suites/file_resources/:id',
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
        project_file_resources: '/sparql_test_suites/project/file_resources'
    },
    shacl_test_suites: {
        items: '/shacl_test_suites',
        item: '/shacl_test_suites/:id',
        file_resources: '/shacl_test_suites/:id/file_resources',
        file_resource: '/shacl_test_suites/file_resources/:id',
    },
    ontology_file_collections: {
        items: '/ontology_file_collections',
        item: '/ontology_file_collections/:id',
        file_resources: '/ontology_file_collections/:id/file_resources',
        file_resource: '/ontology_file_collections/file_resources/:id',
    },
    resource_collections: {
        items: '/resource_collections',
        item: '/resource_collections/:id',
        file_resources: '/resource_collections/:id/file_resources',
        file_resource: '/resource_collections/file_resources/:id',
    },

    mapping_packages: {
        items: '/mapping_packages',
        item: '/mapping_packages/:id',
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
        check_content_terms_validity: '/ontology/check_content_terms_validity',
        search_terms: '/ontology/search_terms',
        prefixed_terms: '/ontology/prefixed_terms',
        clone: '/conceptual_mapping_rules/:id/clone',
        tasks: {
            generate_cm_assertions_queries: '/conceptual_mapping_rules/tasks/generate_cm_assertions_queries'
        }
    },

    triple_map_fragments: {
        items: '/triple_map_fragments',
        item: '/triple_map_fragments/:id',
    },

    generic_triple_map_fragments: {
        items: '/generic_triple_map_fragments',
        item: '/generic_triple_map_fragments/:id',
        tree:'/test_data_suites/file_resources_struct_tree',
        content: (id) => `/test_data_suites/file_resources/${id}/content`,
        transform_result_content: (id, triple_map_id) => `/test_data_suites/file_resources/${id}/transform/generic_triple_map/${triple_map_id}`
    },

    specific_triple_map_fragments: {
        items: '/specific_triple_map_fragments',
        item: '/specific_triple_map_fragments/:id'
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
        me: '/users/me'
    },

    fields_registry: {
        items: '/fields_registry',
        item: '/fields_registry/:id',
        import_eforms_from_github: '/fields_registry/tasks/import_eforms_from_github',
        elements: '/fields_registry/elements',
        elements_tree: '/fields_registry/elements_tree',
        element: '/fields_registry/elements/:id',
    },

    schema: {
        items: '/fields_registry',
        item: '/fields_registry/:id',
        import_eforms_from_github: '/fields_registry/tasks/import_eforms_from_github',
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

    tasks: {
        items: '/task_manager',
        task_cancel: (task_id) => `/task_manager/cancel/${task_id}`,
        task_delete: (task_id) => `/task_manager/delete/${task_id}`,
        task_delete_all:'/task_manager/delete_all',
        terms_validator: '/tasks/terms_validator',
        generate_cm_assertions_queries: '/tasks/generate_cm_assertions_queries',
        transform_test_data: '/tasks/transform_test_data'
    }
}