export const paths = {
  index: '/',
  auth: {
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register'
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
      file_manager: {
        index: '/app/test-data-suites/[id]/file-manager',
        create: '/app/test-data-suites/[id]/file-manager/create',
        edit: '/app/test-data-suites/[id]/file-manager/[fid]/edit',
        view: '/app/test-data-suites/[id]/file-manager/[fid]/view',
      }
    },
    sparql_test_suites: {
      index: '/app/sparql-test-suites',
      create: '/app/sparql-test-suites/create',
      edit: '/app/sparql-test-suites/[id]/edit',
      view: '/app/sparql-test-suites/[id]/view',
      file_manager: {
        index: '/app/sparql-test-suites/[id]/file-manager',
        create: '/app/sparql-test-suites/[id]/file-manager/create',
        edit: '/app/sparql-test-suites/[id]/file-manager/[fid]/edit',
        view: '/app/sparql-test-suites/[id]/file-manager/[fid]/view',
      }
    },
    shacl_test_suites: {
      index: '/app/shacl-test-suites',
      create: '/app/shacl-test-suites/create',
      edit: '/app/shacl-test-suites/[id]/edit',
      view: '/app/shacl-test-suites/[id]/view',
      file_manager: {
        index: '/app/shacl-test-suites/[id]/file-manager',
        create: '/app/shacl-test-suites/[id]/file-manager/create',
        edit: '/app/shacl-test-suites/[id]/file-manager/[fid]/edit',
        view: '/app/shacl-test-suites/[id]/file-manager/[fid]/view',
      }
    },
    ontology_file_collections: {
      index: '/app/ontology-file-collections',
      create: '/app/ontology-file-collections/create',
      edit: '/app/ontology-file-collections/[id]/edit',
      view: '/app/ontology-file-collections/[id]/view',
      file_manager: {
        index: '/app/ontology-file-collections/[id]/file-manager',
        create: '/app/ontology-file-collections/[id]/file-manager/create',
        edit: '/app/ontology-file-collections/[id]/file-manager/[fid]/edit',
        view: '/app/ontology-file-collections/[id]/file-manager/[fid]/view',
      }
    },
    resource_collections: {
      index: '/app/resource-collections',
      create: '/app/resource-collections/create',
      edit: '/app/resource-collections/[id]/edit',
      view: '/app/resource-collections/[id]/view',
      file_manager: {
        index: '/app/resource-collections/[id]/file-manager',
        create: '/app/resource-collections/[id]/file-manager/create',
        edit: '/app/resource-collections/[id]/file-manager/[fid]/edit',
        view: '/app/resource-collections/[id]/file-manager/[fid]/view',
      }
    },

    package_collections: {
      index: '/app/package_collections',
      create: '/app/package_collections/create',
      edit: '/app/package_collections/[id]/edit',
      view: '/app/package_collections/[id]/view',
      file_manager: {
        index: '/app/package_collections/[id]/file-manager',
        create: '/app/package_collections/[id]/file-manager/create',
        edit: '/app/package_collections/[id]/file-manager/[fid]/edit',
        view: '/app/package_collections/[id]/file-manager/[fid]/view',
      }
    },

    users: {
      index: '/app/users',
      edit: '/app/users/[id]/edit',
      view: '/app/users/[id]/view'
    },
    account: '/app/account',
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500'
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
  },
  sparql_test_suites: {
    items: '/sparql_test_suites',
    item: '/sparql_test_suites/:id',
    file_resources: '/sparql_test_suites/:id/file_resources',
    file_resource: '/sparql_test_suites/file_resources/:id',
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

  package_collections: {
    items: '/package_collections',
    item: '/package_collections/:id',
    file_resources: '/package_collections/:id/file_resources',
    file_resource: '/package_collections/file_resources/:id',
  }

}