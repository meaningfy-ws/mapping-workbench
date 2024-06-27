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
    isFlureeHosted: true,
    apiKey: 'qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw',
    ledger: 'fluree-jld/387028092978552',
    // privateKey: '2fd4ee98c23f427ef37500ddb296de883c9013b319c72ebd76e151a820defe57',
    // signMessages: true,
}).connect();

client.generateKeyPair()

const did = client.getDid()
console.log(did)
// client.generateKeyPair()
// client.setKey(client.getPrivateKey())
// console.log(client.getPrivateKey())

// client.setKey(privateKey)
const Page = () => {

    const [items, setItems ] = useState([])
    const [state, setState] = useState({})
    const [dataState, setDataState] = useState({})

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
          ],
         "opts": {
             "did": did
         }
    })

    const getTransaction = client.query({
          "@context": {
            "ex": "http://example.org/",
            "schema": "http://schema.org/"
          },
          "from": "fluree-jld/387028092978552",
          "where": {
            "@id": "?s",
            "schema:description": "?o"
          },
          "selectDistinct": { "?s": ["*"] },
           "opts": {
             "did": did
         }
    }).sign()

//
// signedTransaction = client
//   .transact({
//     insert: { '@id': 'freddy', name: 'Freddy' },
//   })
//   .sign();

// const response = await signedTransaction.send();

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
