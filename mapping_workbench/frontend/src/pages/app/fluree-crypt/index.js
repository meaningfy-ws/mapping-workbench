import {useEffect, useState} from "react";

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Drawer from "@mui/material/Drawer";
import Typography from '@mui/material/Typography';

import {flureeCryptApi as sectionApi} from 'src/api/fluree-crypt';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {ListTable} from "src/sections/app/fluree-crypt/list-table";
import CardHeader from "@mui/material/CardHeader";
import {useFormik} from "formik";
import {FormTextField} from "../../../components/app/form/text-field";
import * as Yup from "yup";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {TableLoadWrapper} from "../../../sections/app/shacl-validation-report/utils";
import CardContent from "@mui/material/CardContent";
import {generateKeyPair, getSinFromPublicKey, signQuery, signTransaction} from "@fluree/crypto-utils";

const { publicKey: authorityPubKey, privateKey: authorityPrivKey } = generateKeyPair();

const authorityAuthId = getSinFromPublicKey(authorityPubKey);

const authority = {
    authId: authorityAuthId,
    privKey: authorityPrivKey,
}

const { publicKey: userPubKey } = generateKeyPair();
const userAuthId = getSinFromPublicKey(userPubKey);

const user = {
  authId: userAuthId,
};

console.log('user',user)

const Page = () => {

    const [items, setItems ] = useState([])
    const [state, setState] = useState({})
    const [dataState, setDataState] = useState({})

    const queryAsUser = () =>
  fetch(
    `http://localhost:8090/fdb/authority/test/query`,
    signQuery(
      authority.privKey, //note the use of the authority's private key
      sectionApi.queryString,
      'query',
      'authority/test',
      user.authId //note the use of the end user's auth id
    )
  )
    .then((res) => res.json())
    .then((res) => {
        // setItems(res)
            console.log(
                'QUERY AS USER:\n\n',
                JSON.stringify(res, null, 2),
                '\n\n---\n'
            )
        }
    );

    const queryAsRoot = () =>
  fetch(`http://localhost:8090/fdb/authority/test/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: sectionApi.queryString,
  })
    .then((res) => res.json())
    .then((res) =>{
        console.log(res)
        if(!res.status)
            setItems(res)
      console.log('QUERY AS ROOT:\n\n', JSON.stringify(res, null, 2))

    }
    )
      .catch(err => console.log(err));


    const addItem = (id, type, description) => {
        setState(e=> ({ ...e, load: true }))
        const toastId = toastLoad('Adding item...')
        sectionApi.transactInsertData(id, type, description)
            .then(res => {
                toastSuccess('Added successfully', toastId)
                // getItems()
                setState(e=>({ ...e, drawerOpen: false, load: false }))
            })
            .catch(err => toastError(err, toastId))
    }
    //
    // const updateItem = (oldId, id, type, description) => {
    //     setState(e=>({ ...e, load: true }))
    //     const toastId = toastLoad('Updating item...')
    //     deleteTransaction(oldId).send()
    //         .then(res => {
    //             postTransaction(id, type, description).send()
    //                 .then(res => {
    //                     setState(e=>({ ...e, drawerOpen: false, load: false }))
    //                     getItems()
    //                     toastSuccess('Updated successfully',toastId)
    //                 })
    //             }
    //         )
    //         .catch(err => toastError(err, toastId))
    // }
    //
    // const deleteItem = (id, type) => {
    //     setState(e=>({...e, load: true}))
    //     const toastId = toastLoad('Deleting item...')
    //     deleteTransaction(id, type).send()
    //         .then(res => {
    //             getItems()
    //             toastSuccess('Deleted successfully', toastId)
    //         })
    //         .catch(err => toastError(err, toastId))
    //         .finally(()=> setState(e => ({ ...e, load: false })))
    // }
    //
    //
    // const getItems = () => {
    //     setDataState(e=> ({...e, load: true}))
    //     getTransaction.send()
    //        .then(res => {
    //            setDataState(e => ({}))
    //            setItems(res)
    //        })
    //       .catch(err => setDataState({load: false, error: err}))
    // }

    useEffect(() => {
        // createDb()
        //   .then(transactSchemaData)
        //   .then(transactSeedData)
        getQuery()
    }, []);


    const getQuery = () => {
           queryAsUser()
          .then(queryAsRoot)
          .catch(console.error);
    }

    usePageView();

    const createDbAction = () => {
        setState({load:true})
            sectionApi.createDb()
              .then(sectionApi.transactSchemaData)
              .then(() => sectionApi.transactSeedData(user,authority))
                .then(setState({load:false}))
    }

    console.log('items',items)

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
                            onClick={getQuery}>Refresh</Button>
                    <Button disabled={state.load}
                            onClick={()=>setState({ drawerOpen: true })}>Add item</Button>
                    <Button disabled={state.load}
                            onClick={()=> createDbAction() }>Create DB</Button>

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
