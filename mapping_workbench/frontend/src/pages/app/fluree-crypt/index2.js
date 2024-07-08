
import {
  generateKeyPair,
  getSinFromPublicKey,
  signQuery,
} from "@fluree/crypto-utils";
import {Layout as AppLayout} from "../../../layouts/app";

/*
First we generate a key pair for the authority.

We will ultimately need the _auth/id (i.e. the pubkey hash) of the authority to identify the authority in the database.

We will also need to safely store the private key, as it will be the only private key used to sign queries/transactions
*/
const { publicKey: authorityPubKey, privateKey: authorityPrivKey } =
  generateKeyPair();
const authorityAuthId = getSinFromPublicKey(authorityPubKey);

const authority = {
  authId: authorityAuthId,
  privKey: authorityPrivKey,
};

/*
Note that, when generating a key pair for the end user, we do not need to store or save the private key.

The goal here, of course, is for the end user to never need to manage a private key. 
We only effectively need the _auth/id (i.e. the pubkey hash) of the end user to identify the end user in the database.

We will also be using the _auth/id when signing queries/transactions, but only to identify that 
the AUTHORITY'S PRIVATE KEY is signing ON BEHALF OF the end user.
*/
const { publicKey: userPubKey } = generateKeyPair();
const userAuthId = getSinFromPublicKey(userPubKey);

const user = {
  authId: userAuthId,
};

/*
For the sake of this example, we will keep the schema very simple.

We are adding a "secretValue" and a "publicValue" to _auth entities.

The goal will be to show that the end user can see THEIR OWN secret value, but not the authority's secret value, 
even though we use the authority's private key to sign a query from the end user.
*/
const schemaTxn = [
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

/*
This transaction establishes two things. We add our _auth records for the end user and for the authority.

We also establish the very minimal smart functions/rules/roles necessary to demonstrate the behavior.

The end user has one restriction. They can only read/write against an _auth/secretValue if it is their own _auth record.

!!NOTE!!
The one important thing to acknowledge is that the end user's record refers to the authority's record via the "authority" predicate.
If this relationship from end user _auth --> authority _auth didn't exist, the authority WOULD NOT BE ALLOWED to sign a query/txn on behalf of the end user.
*/
const seedTxn = [
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

/*
Our query is simple, it looks for all data on all _auth records.
*/
const queryObj = {
  select: ['*'],
  from: '_auth',
};

const queryString = JSON.stringify(queryObj);

/*
When we query as a user, we sign the query with...
    1. The authority's private key
    2. The end user's auth id

Fluree will evaluate this query with the following model:
    1. It will evaluate the signature and confirm that the payload matches the signature (i.e. that the signature validates the integrity of the payload)
    2. It will recover the public key / auth id from the signature
    3. It will see if the recovered auth id matches the provided auth id
    4. NOTE!! In this case, THEY WILL NOT MATCH (because the auth id we provided belongs to the end user, and is not derived from the authority's private key that was used to sign the txn)
    5. Fluree will then lookup the provided auth id and see if it delegates authority to the auth id recovered from the signature
    6. In this case, it DOES DEFER AUTHORITY
    7. Fluree will accept the query with the smart fn rules/roles that apply to the end user, NOT to the authority
*/
const queryAsUser = () =>
  fetch(
    `http://localhost:8090/fdb/authority/test/query`,
    signQuery(
      authority.privKey, //note the use of the authority's private key
      queryString,
      'query',
      'authority/test',
      user.authId //note the use of the end user's auth id
    )
  )
    .then((res) => res.json())
    .then((res) =>
      console.log(
        'QUERY AS USER:\n\n',
        JSON.stringify(res, null, 2),
        '\n\n---\n'
      )
    );

/*
We query as root to show that the authority has a secretValue, even though the queryAsUser() response only included the user's secretValue
*/
const queryAsRoot = () =>
  fetch(`http://localhost:8090/fdb/authority/test/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: queryString,
  })
    .then((res) => res.json())
    .then((res) =>
      console.log('QUERY AS ROOT:\n\n', JSON.stringify(res, null, 2))
    );

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const flureeFetch = (path, method, body) =>
  fetch(`http://localhost:8090/fdb/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(() => delay(1000));

const createDb = () =>
  flureeFetch('new-ledger', 'POST', { 'ledger/id': 'authority/test' });

const transactSchemaData = () =>
  flureeFetch('authority/test/transact', 'POST', schemaTxn);

const transactSeedData = () =>
  flureeFetch('authority/test/transact', 'POST', seedTxn);




const Page = () => {
   createDb()
  .then(transactSchemaData)
  .then(transactSeedData)
  .then(queryAsUser)
  .then(queryAsRoot)
  .catch(console.error);

  return (
      <>
      </>)
}


Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
