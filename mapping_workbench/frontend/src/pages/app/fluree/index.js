import {useEffect, useState} from "react";
import { FlureeClient } from '@fluree/fluree-client';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Drawer from "@mui/material/Drawer";
import Typography from '@mui/material/Typography';

import {flureeApi as sectionApi} from 'src/api/fluree';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {ListTable} from "src/sections/app/fluree/list-table";
import CardHeader from "@mui/material/CardHeader";
import {useFormik} from "formik";
import {FormTextField} from "../../../components/app/form/text-field";
import * as Yup from "yup";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {TableLoadWrapper} from "../../../sections/app/shacl_validation_report/utils";
import CardContent from "@mui/material/CardContent";




const client = await new FlureeClient({
    // isFlureeHosted: true,
    // apiKey: 'qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw',
    // ledger: 'fluree-jld/387028092978552',
    ledger: 'fluree-jld/387028092978552',
    host: 'localhost',
    port: 58090,
    // create:true,
    privateKey: '2fd4ee98c23f427ef37500ddb296de883c9013b319c72ebd76e151a820defe57',
    // signMessages: true,
    // defaultContext:{
    //                 "ex": "http://example.org/",
    //                 "schema": "http://schema.org/"
    //                }
}).connect();

// client.generateKeyPair()

const did = client.getDid()

// console.log(did)
// client.generateKeyPair()
// client.setKey(client.getPrivateKey())
// console.log(client.getPrivateKey())

// client.setKey(privateKey)

const Page = () => {

    const [items, setItems ] = useState([])
    const [state, setState] = useState({})
    const [dataState, setDataState] = useState({})

    const postTransaction = (id, type, description) => client.transact({
          "insert": [
              {
                  "@id": did,
                  "@type": type,
                  "schema:description": description,

                  "f:role": {"@id": "ex:userRole"},
              },

          ],
          // "opts": {
          //           "did": did,
          //        "role": "ex:userRole"
          //       },
         // "opts": {
         //     "did": did
         // }
    })



    const notSignedgetTransaction = client.query({
          // "from": "cookbook/base",
          // "where": {
          //   "@id": "?s",
          //   "schema:description": "?o"
          // },
          // "selectDistinct": { "?s": ["*"] },
          //    "opts": {
          //           "did": did,
          //        "role": "ex:userRole"
          //       },


  // "@context": {
  //   "ex": "http://example.org/"
  // },
  // "from": "policy-view-age",
  "select": {
    "?person": [
      "*"
    ]
  },
  "where": {
    "@id": "?person",
    "@type": "Person"
  }

    })


     const getTransaction = client.query({
  // "@context": {
  //   "ex": "http://example.org/"
  // },
  // "from": "policy-view-age",
  "select": {
    "?person": [
      "*"
    ]
  },
  "where": {
    "@id": "?person",
    "@type": "Person"
  },
  "opts": {
    "role": "ex:alice",
      // did: did
  }


    }).sign()


   // const signedTransaction = client
   //      .transact({
   //        insert: [
   //          {
   //            '@id': 'ex:alice',
   //            'ex:secret': "alice's new secret",
   //          },
   //        ],
   //      })
   //      .sign();

//
// signedTransaction = client
//   .transact({
//     insert: { '@id': 'freddy', name: 'Freddy' },
//   })
//   .sign();

// const response = await signedTransaction.send();

    // const deleteTransaction = (id,type) => client.transact({
    //     "ledger": "fluree-jld/387028092978552",
    //     "where": {
    //         "@id": id,
    //         "?p": "?o"
    //     },
    //     "delete": {
    //         "@id": id,
    //         "?p": "?o"
    //     }
    // })

    const addItem = (id, type, description) => {
        setState(e=> ({ ...e, load: true }))
        const toastId = toastLoad('Adding item...')
        postTransaction(id, type, description).send()
            .then(res => {
                toastSuccess('Added successfully', toastId)
                getItems()
                setState(e=>({ ...e, drawerOpen: false, load: false }))
            })
            .catch(err => toastError(err, toastId))
    }

    const updateItem = (oldId, id, type, description) => {
        setState(e=>({ ...e, load: true }))
        const toastId = toastLoad('Updating item...')
        deleteTransaction(oldId).send()
            .then(res => {
                postTransaction(id, type, description).send()
                    .then(res => {
                        setState(e=>({ ...e, drawerOpen: false, load: false }))
                        getItems()
                        toastSuccess('Updated successfully',toastId)
                    })
                }
            )
            .catch(err => toastError(err, toastId))
    }

    const deleteItem = (id, type) => {
        setState(e=>({...e, load: true}))
        const toastId = toastLoad('Deleting item...')
        deleteTransaction(id, type).send()
            .then(res => {
                getItems()
                toastSuccess('Deleted successfully', toastId)
            })
            .catch(err => toastError(err, toastId))
            .finally(()=> setState(e => ({ ...e, load: false })))
    }

    const setAccess = () => client
        .transact({
          '@context': {
            'f:equals': { '@container': '@list' },
          },
          insert: [
            {
              '@id': 'ex:alice',
              '@type': 'ex:User',
              'ex:secret': "alice's secret",
            },
            {
              '@id': 'ex:bob',
              '@type': 'ex:User',
              'ex:secret': "bob's secret",
            },
            {
              '@id': 'ex:userPolicy',
              '@type': ['f:Policy'],
              'f:targetClass': {
                '@id': 'ex:User',
              },
              'f:allow': [
                {
                  '@id': 'ex:globalViewAllow',
                  'f:targetRole': {
                    '@id': 'ex:userRole',
                  },
                  'f:action': [
                    {
                      '@id': 'f:view',
                    },
                  ],
                },
              ],
              'f:property': [
                {
                  'f:path': {
                    '@id': 'ex:secret',
                  },
                  'f:allow': [
                    {
                      '@id': 'ex:secretsRule',
                      'f:targetRole': {
                        '@id': 'ex:userRole',
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
                          '@id': 'ex:user',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              '@id': did,
              'ex:user': {
                '@id': 'ex:alice',
              },
              'f:role': {
                '@id': 'ex:userRole',
              },
            },
          ],
        })
        .send();


    const addPeople = () => client.transact({
  "ledger": "fluree-jld/387028092978552",
  "@context": {
    "ex": "http://example.org/"
  },
  "insert": [
    {
      "age": 35,
      "name": "Souma Mukerjee",
      "@type": "Person",
      "@id": "2"
    },
    {
      "age": 36,
      "name": "Souradeep Das",
      "@type": "Person",
      "@id": "3"
    },
    {
      "age": 24,
      "name": "Tanmay Kumar",
      "@type": "Person",
      "@id": "ex:Tanmay"
    }
  ]
}).send()


    const addPeoplePolicy = () => client.transact({
  "ledger": "fluree-jld/387028092978552",
  "@context": {
    "ex": "http://example.org/",
    "f": "https://ns.flur.ee/ledger#"
  },
  "insert": [{
    "@id": "did:fluree:2",
    "ex:user": { "@id": "ex:Tanmay" },
    "f:role": { "@id": "ex:nameViewRole" }
  },
  {
    "@id": "ex:NameViewPolicy",
    "@type": ["f:Policy"],
    "f:targetClass": { "@id": "Person" },
    "f:allow": [
      {
        "@id": "ex:nameViewAllow",
        "f:targetRole": { "@id": "ex:nameViewRole" },
        "f:action": [{ "@id": "f:view" }]
      }
    ],
    "f:property": [
      {
        "@id": "ex:subsOnlyViewName",
        "f:path": { "@id": "age" },
        "f:allow": [
          {
            "@id": "ex:ageViewRule",
            "f:targetRole": { "@id": "ex:nameViewRole" },
            "f:action": [{ "@id": "f:view" }],
            "f:equals": {
              "@list": [{ "@id": "f:$identity" }, { "@id": "ex:user" }]
            }
          }
        ]
      }
    ]
  }]
}).send()

    const getItems = () => {
        setDataState(e=> ({...e, load: true}))

        getTransaction.send()
           .then(res => {
               setDataState(e => ({}))
               setItems(res)
           })
          .catch(err => setDataState({load: false, error: err}))
    }

    useEffect(() => {
        getItems()
    }, []);

    usePageView();


    const formik = useFormik({
        initialValues: {
            '@id': state.item?.['@id'] || '',
            '@type': state.item?.['@type'] || '',
            'schema:description': state.item?.['schema:description'] || ''
        },
        validationSchema: Yup.object({
            "@id": Yup
                .string()
                .max(255)
                .required('@Id is required'),
            "@type": Yup.string().max(255).required('Type is required')
        }),
        onSubmit: (values, helpers) => {
            if(state.item?.['@id'])
                updateItem(state.item['@id'], values['@id'], values['@type'], values['schema:description'])
            else addItem(values['@id'],values['@type'], values['schema:description'])
        },
        enableReinitialize: true
    })

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.SECTION_TITLE}
                        </Typography>
                        <Breadcrumbs separator={<BreadcrumbsSeparator/>}>

                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Button onClick={()=>addPeoplePolicy()}>Set Access</Button>
                    <Button disabled={state.load}
                            onClick={()=>setState({ drawerOpen: true })}>Add item</Button>

                </Stack>
                <Card>
                    <TableLoadWrapper dataState={dataState}
                              data={items}>
                        <ListTable
                            onEdit={(item) => setState({ drawerOpen: true, item })}
                            onDelete={(item) => deleteItem(item["@id"],item['@type'])}
                            items={items}
                            disabled={state.load}
                            sectionApi={sectionApi}/>
                    </TableLoadWrapper>
                </Card>
            </Stack>
            <Drawer
                anchor='right'
                open={state.drawerOpen}
                onClose={() => setState(e=>({...e, drawerOpen: false}))}>
                <form onSubmit={formik.handleSubmit}
                     >

                    <Card sx={{width: 400}} >
                        <CardHeader title={state.item ? 'Edit Item' : 'Create Item'}/>
                        <CardContent>
                            <Stack direction='column'
                                   gap={3}>
                                <Typography></Typography>
                                <FormTextField formik={formik}
                                               name="@id"
                                               label="Id"/>
                                <FormTextField formik={formik}
                                               name="@type"
                                               label="Type"/>
                                <FormTextField formik={formik}
                                               name="schema:description"
                                               label="Description"/>
                            </Stack>
                        </CardContent>
                          <Button type='submit'
                                  sx={{width: '100%'}}
                            disabled={state.load}>Save</Button>
                    </Card>

                </form>
            </Drawer>
        </>
)
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
