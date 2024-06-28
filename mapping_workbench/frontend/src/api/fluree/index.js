import {ACTION, SectionApi} from "../section";
import {appApi} from "../app";
import {sessionApi} from "../session";

class FlureeApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fluree";
    }

    get SECTION_TREE_TITLE() {
        return "Elements Tree"
    }

    get SECTION_ITEM_TITLE() {
        return "Fields Registry";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    setAccess(did) {
        return {
            '@context': {
                'f:equals': {'@container': '@list'},
            },
            insert: [
                {
                    '@id': 'ex:freddy',
                    '@type': 'ex:Yeti',
                    'ex:yetiSecret': "freddy's secret",
                },
                {
                    '@id': 'ex:letty',
                    '@type': 'ex:Yeti',
                    'ex:yetiSecret': "letty's secret",
                },
                {
                    '@id': 'ex:yetiPolicy',
                    '@type': ['f:Policy'],
                    'f:targetClass': {
                        '@id': 'ex:Yeti',
                    },
                    'f:allow': [
                        {
                            '@id': 'ex:globalViewAllowForYetis',
                            'f:targetRole': {
                                '@id': 'ex:yetiRole',
                            },
                            'f:action': [
                                {
                                    '@id': 'f:view',
                                },
                                //add right to edit
                                {
                                    '@id': 'f:modify',
                                },
                            ],
                        },
                    ],
                    'f:property': [
                        {
                            '@id': 'ex:property2',
                            'f:path': {
                                '@id': 'ex:yetiSecret',
                            },
                            'f:allow': [
                                {
                                    '@id': 'ex:yetiSecretsRule',
                                    'f:targetRole': {
                                        '@id': 'ex:yetiRole',
                                    },
                                    'f:action': [
                                        {
                                            '@id': 'f:view',
                                        },
                                        {
                                            '@id': 'f:modify',
                                        },
                                    ],
                                    'f:equals': [
                                        {
                                            '@id': 'f:$identity',
                                        },
                                        {
                                            '@id': 'ex:yeti',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    '@id': did,
                    'ex:yeti': {
                        '@id': 'ex:freddy',
                    },
                    'f:role': {
                        '@id': 'ex:yetiRole',
                    },
                },
            ]
        }
    }

    getData() {
        return {
            "where": {
                "@id": "?s",
                "ex:yetiSecret": "?secret"
            },
            "select": ["?s","?secret"]
        }
    }

    addData(secret) {
        return {
             insert: [
            {
              '@id': 'ex:freddy',
              '@type': 'ex:Yeti',
              'ex:yetiSecret': secret,
            }]
        }
    }

    deleteData(secret,user) {
        return {
            where: {
             "@id": "?s",
                "ex:yetiSecret": "?secret"
            },
             delete:
            {
              '@id': user,
              '@type': 'ex:Yeti',
              'ex:yetiSecret': secret,
            }
        }
    }

    async getItemsTree() {
        let filters = {}
        if (this.isProjectResource) {
            filters['project'] = sessionApi.getSessionProject();
        }
        return await appApi.get(this.paths['elements_tree'], filters);
    }
}

export const flureeApi = new FlureeApi();
