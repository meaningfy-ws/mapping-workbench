export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    auth0: {
      callback: '/auth/auth0/callback',
      login: '/auth/auth0/login'
    },
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register'
    },
    firebase: {
      login: '/auth/firebase/login',
      register: '/auth/firebase/register'
    },
    amplify: {
      confirmRegister: '/auth/amplify/confirm-register',
      forgotPassword: '/auth/amplify/forgot-password',
      login: '/auth/amplify/login',
      register: '/auth/amplify/register',
      resetPassword: '/auth/amplify/reset-password'
    }
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern'
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern'
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern'
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern'
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern'
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
      view: '/app/test-data-suites/[id]/view'
    },
    sparql_test_suites: {
      index: '/app/sparql-test-suites',
      create: '/app/sparql-test-suites/create',
      edit: '/app/sparql-test-suites/[id]/edit',
      view: '/app/sparql-test-suites/[id]/view',
      file_manager: '/app/sparql-test-suites/[id]/file-manager'
    },
    shacl_test_suites: {
      index: '/app/shacl-test-suites',
      create: '/app/shacl-test-suites/create',
      edit: '/app/shacl-test-suites/[id]/edit',
      view: '/app/shacl-test-suites/[id]/view'
    },
    ontology_file_collections: {
      index: '/app/ontology-file-collections',
      create: '/app/ontology-file-collections/create',
      edit: '/app/ontology-file-collections/[id]/edit',
      view: '/app/ontology-file-collections/[id]/view'
    },
    resource_collections: {
      index: '/app/resource-collections',
      create: '/app/resource-collections/create',
      edit: '/app/resource-collections/[id]/edit',
      view: '/app/resource-collections/[id]/view'
    },
    fileManager: '/app/file-manager',
    users: {
      index: '/app/users',
      edit: '/app/users/[id]/edit',
      view: '/app/users/[id]/view'
    },
  },
  dashboard: {
    index: '/dashboard',
    academy: {
      index: '/dashboard/academy',
      courseDetails: '/dashboard/academy/courses/:courseId'
    },
    account: '/dashboard/account',
    analytics: '/dashboard/analytics',
    blank: '/dashboard/blank',
    blog: {
      index: '/dashboard/blog',
      postDetails: '/dashboard/blog/:postId',
      postCreate: '/dashboard/blog/create'
    },
    calendar: '/dashboard/calendar',
    chat: '/dashboard/chat',
    crypto: '/dashboard/crypto',
    customers: {
      index: '/dashboard/customers',
      details: '/dashboard/customers/:customerId',
      edit: '/dashboard/customers/:customerId/edit'
    },
    ecommerce: '/dashboard/ecommerce',
    fileManager: '/dashboard/file-manager',
    invoices: {
      index: '/dashboard/invoices',
      details: '/dashboard/invoices/:orderId'
    },
    jobs: {
      index: '/dashboard/jobs',
      create: '/dashboard/jobs/create',
      companies: {
        details: '/dashboard/jobs/companies/:companyId'
      }
    },
    kanban: '/dashboard/kanban',
    logistics: {
      index: '/dashboard/logistics',
      fleet: '/dashboard/logistics/fleet'
    },
    mail: '/dashboard/mail',
    orders: {
      index: '/dashboard/orders',
      details: '/dashboard/orders/:orderId'
    },
    products: {
      index: '/dashboard/products',
      create: '/dashboard/products/create'
    },
    social: {
      index: '/dashboard/social',
      profile: '/dashboard/social/profile',
      feed: '/dashboard/social/feed'
    }
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats'
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists'
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs'
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
    item: '/test_data_suites/:id'
  },
  sparql_test_suites: {
    items: '/sparql_test_suites',
    item: '/sparql_test_suites/:id'
  }
}