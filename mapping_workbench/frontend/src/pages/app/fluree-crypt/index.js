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
import {generateKeyPair, getSinFromPublicKey, signQuery, signTransaction} from "@fluree/crypto-utils";
import axios from "axios";

// const client = await new FlureeClient({
//   isFlureeHosted: true,
//   apiKey: 'qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw',
//   ledger: 'fluree-jld/387028092978552',
// }).connect();


const { publicKey: authorityPubKey, privateKey: authorityPrivKey } =  generateKeyPair();
const authorityAuthId = getSinFromPublicKey(authorityPubKey);

const authority = {
  authId: authorityAuthId,
  privKey: authorityPrivKey,
};

const { publicKey: userPubKey } = generateKeyPair();
const userAuthId = getSinFromPublicKey(userPubKey);

const user = {
  authId: userAuthId,
};


const queryObj = {
          "@context": {
            "ex": "http://example.org/",
            "schema": "http://schema.org/"
          },
          "From": "fluree-jld/387028092978552",
          "where": {
            "@id": "?s",
            "schema:description": "?o"
          },
          "selectDistinct": { "?s": ["*"] }
    };

const queryString = JSON.stringify({select: ["*"], from: 'fluree-jld/387028092978552'});


const Page = () => {

    const [items, setItems ] = useState([])
    const [state, setState] = useState({})
    const [dataState, setDataState] = useState({})


    const command = signQuery(
                  authority.privKey, //note the use of the authority's private key
                  JSON.stringify(queryString),
                  'query',
                  'fluree-jld/387028092978552',
                //  user.authId //note the use of the end user's auth id
    )

    // command.headers[":authority:"] = "data.flur.ee"
    // command.headers[":method:"] = "POST"
    // command.headers[":path:"] = "/fluree/query"
    // command.headers[":scheme:"] = "https"
    // command.headers["Content-Type"] = "application/json"
    // command.headers["Authorization"] = "Bearer qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw"
    // command.headers["Accept"] = "*/*"
    // command.headers["Accept-Encoding"] = "gzip, deflate, br, zstd"
    // command.headers["Accept-Language"] = "en-US,en;q=0.9"




    // command.headers['Access-Control-Allow-Origin'] = '*'
    // command.headers['Access-Control-Allow-Headers'] = 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    // command.headers['Access-Control-Allow-Credentials'] = 'true'
    // command.headers["Access-Control-Allow-Methods"] = "GET, PUT, POST, DELETE, HEAD, OPTIONS"
    // command.headers['mode']='no-cors'

    Object.assign(command, {"txid-only": false});

    console.log(command)

    const query = async () =>  {
        const response = await axios.post('https://data.flur.ee/fluree/query',
            command
            )
    }
    const queryAsUser = () => {
        console.log(queryString)
      fetch(
        `https://data.flur.ee/fluree/query`,

              command
      )
        .then((res) => {
            console.log(res)
            return res.json()
        })
        .then((res) =>
          console.log(
            'QUERY AS USER:\n\n',
            JSON.stringify(res, null, 2),
            '\n\n---\n'
          )
        )
          .catch(err => console.error(err));
        }

       const queryAsUsers = () =>
           axios.post(
               `https://data.flur.ee/fluree/query`,
               command
           )

        const flureeFetch = (path, method, body) =>
  fetch(`https://data.flur.ee/fluree/query`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(() => delay(1000));

    const postTransaction = (id, type, description) => client.transact({
          "@context": {
            "ex": "http://example.org/",
            "schema": "http://schema.org/"
          },
          "insert": [
            {
              "@id": id,
              "@type": type,
              "schema:description": description
            }
          ]
    })

    // const getTransaction = client.query({
    //       "@context": {
    //         "ex": "http://example.org/",
    //         "schema": "http://schema.org/"
    //       },
    //       "from": "fluree-jld/387028092978552",
    //       "where": {
    //         "@id": "?s",
    //         "schema:description": "?o"
    //       },
    //       "selectDistinct": { "?s": ["*"] }
    // })

    const deleteTransaction = (id,type) => client.transact({
        "@context": {
            "ex":  "http://example.org/"
        },
        "ledger": "fluree-jld/387028092978552",
        "where": {
            "@id": id,
            "?p": "?o"
        },
        "delete": {
            "@id": id,
            "?p": "?o"
        }
    })

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
        query()
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
