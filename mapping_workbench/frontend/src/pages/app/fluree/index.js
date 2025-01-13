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
import CardContent from "@mui/material/CardContent";
import {TableLoadWrapper} from '../../../sections/app/shacl-validation-report/utils';

let client
let did
try {
 client = await new FlureeClient({
    // isFlureeHosted: true,
    // apiKey: 'qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw',
    ledger: 'fluree-jld/387028092978552',
    host: 'localhost',
    port: 58090,
    privateKey: '2fd4ee98c23f427ef37500ddb296de883c9013b319c72ebd76e151a820defe57',
    // defaultContext:{
    //                 "ex": "http://example.org/",
    //                 "schema": "http://schema.org/"
    //                }
}).connect();

// client.generateKeyPair()

client.setContext({
    f: 'https://ns.flur.ee/ledger#',
    ex: 'http://example.org/',
  });
 did = client.getDid()

}
catch (err) {console.error(err)}



const Page = () => {

    const [items, setItems] = useState([])
    const [state, setState] = useState({})
    const [dataState, setDataState] = useState({})

    const getTransaction = () => client.query(
         sectionApi.getData())
            .sign()


    const postTransaction = (secret) => client.transact(
          sectionApi.addData(secret))
              .sign()


    const deleteTransaction = (user, secret) => client.transact(
        sectionApi.deleteData(user, secret))
            .sign()



    const addItem = (secret) => {
        setState(e=> ({ ...e, load: true }))
        const toastId = toastLoad('Adding item...')
        postTransaction(secret).send()
            .then(res => {
                toastSuccess('Added successfully', toastId)
                getItems()
                setState(e=>({ ...e, drawerOpen: false, load: false }))
            })
            .catch(err => toastError(err, toastId))
    }

    const updateItem = (oldSecret, secret, user) => {
        setState(e=>({ ...e, load: true }))
        const toastId = toastLoad('Updating item...')
        deleteTransaction(user, oldSecret).send()
            .then(res => {
                postTransaction(secret, user).send()
                    .then(res => {
                        setState(e=>({ ...e, drawerOpen: false, load: false }))
                        getItems()
                        toastSuccess('Updated successfully',toastId)
                    })
                }
            )
            .catch(err => toastError(err, toastId))
    }

    const deleteItem = (user, secret) => {
        setState(e=>({...e, load: true}))
        const toastId = toastLoad('Deleting item...')
        deleteTransaction(user, secret).send()
            .then(res => {
                getItems()
                toastSuccess('Deleted successfully', toastId)
            })
            .catch(err => toastError(err, toastId))
            .finally(()=> setState(e => ({ ...e, load: false })))
    }

    const setAccess = () => client
        .transact(sectionApi.setAccess(did))
        .send();


    const getItems = () => {
        setDataState(e=> ({...e, load: true}))

        getTransaction().send()
           .then(res => {
               setDataState(e => ({}))
               setItems(res.map(e=>({user:e[0],secret:e[1]})))
           })
          .catch(err => setDataState({load: false, error: err}))
    }

    useEffect(() => {
        console.log('client',client)
        client && getItems()
    }, [client]);

    usePageView();


    const formik = useFormik({
        initialValues: {
            'secret': state.item?.secret || '',
        },
        validationSchema: Yup.object({
            "secret": Yup
                .string()
                .max(255)
                .required('Secret is required'),
        }),
        onSubmit: (values, helpers) => {
            if(state.item)
                updateItem(state.item?.secret, values['secret'], state.item?.user)
            else addItem(values['secret'])
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
                    <Button onClick={()=>setAccess()}>Set Access</Button>
                    <Button disabled={state.load}
                            onClick={()=>setState({ drawerOpen: true })}>Add item</Button>

                </Stack>
                <Card>
                    <TableLoadWrapper dataState={dataState}
                              data={items}>
                        <ListTable
                            onEdit={(item) => setState({ drawerOpen: true, item })}
                            onDelete={(item) => deleteItem(item.user, item.secret)}
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
                                               name="secret"
                                               label="Secret"/>
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
