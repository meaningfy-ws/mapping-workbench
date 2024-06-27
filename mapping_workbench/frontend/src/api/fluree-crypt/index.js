import {ACTION, SectionApi} from "../section";

class FlureeCryptApi extends SectionApi {
    get SECTION_TITLE() {
        return "Fluree Crypt";
    }

    get SECTION_LIST_ACTIONS() {
        return [ACTION.VIEW];
    }

    schemaTxn = [
        {
            _id: '_predicate',
            name: '_auth/secretValue',
            type: 'string',
        },
        {
            _id: '_predicate',
            name: '_auth/publicValue',
            type: 'string',
        },
    ];

    seedTxn = (user, authority) => [
        {
            _id: '_auth$user',
            id: user.authId,
            roles: ['_role$generic'],
            authority: ['_auth$authority'],
            secretValue: 'end user secret value',
            publicValue: 'end user public value',
        },
        {
            _id: '_auth$authority',
            id: authority.authId,
            roles: ['_role$generic'],
            secretValue: 'authority secret value',
            publicValue: 'authority public value',
        },
        {
            _id: '_role$generic',
            id: 'UserRole',
            rules: ['_rule$generic', '_rule$secretValue'],
        },
        {
            _id: '_rule$generic',
            id: 'genericAuthRule',
            collection: '_auth',
            collectionDefault: true,
            fns: [['_fn/name', 'true']],
            ops: ['all'],
        },
        {
            _id: '_rule$secretValue',
            id: 'authSecretValueRule',
            collection: '_auth',
            predicates: ['_auth/secretValue'],
            fns: ['_fn$secretValueFn'],
            ops: ['all'],
        },
        {
            _id: '_fn$secretValueFn',
            name: 'secretValueFn',
            code: '(== (?auth_id) (?sid))',
        },
    ];


    queryObj = {
        select: ['*'],
        from: '_auth',
    };

    queryAll = {
        select: ["*"],
        from: "_collection"
    }

    queryString = JSON.stringify(this.queryObj);

    delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    flureeFetch = (path, method, body) =>
        fetch(`http://localhost:8090/fdb/${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(() => this.delay(1000));

    createDb = () =>
        this.flureeFetch('new-ledger', 'POST', {'ledger/id': 'authority/test'});

    transactSchemaData = () =>
        this.flureeFetch('authority/test/transact', 'POST', this.schemaTxn);

    transactSeedData = (user,autority) =>
        this.flureeFetch('authority/test/transact', 'POST', this.seedTxn(user,autority));


    transactInsertData = (id, type, description) =>
        this.flureeFetch('authority/test/transact','POST', this.insertData(id, type, description))

    insertData = (id, type, description) => [{
        "@id": id,
        "@type": type,
        "schema:description": description
    }]

}

export const flureeCryptApi = new FlureeCryptApi();
