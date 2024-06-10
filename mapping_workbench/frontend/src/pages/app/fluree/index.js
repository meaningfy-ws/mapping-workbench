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

const client = await new FlureeClient({
  isFlureeHosted: true,
  apiKey: 'qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw',
  ledger: 'fluree-jld/387028092978552',
}).connect();

const Page = () => {

    const [items, setItems ] = useState([])
    const [drawer, setDrawer] = useState({})

    const queryInstance = client.query({
         "from": "fluree-jld/387028092978552",
          "where": {
            "@id": "?s",
            "name": "?name"
          },
          "select": { "?s": ["*"] }
    });

    const transaction = client.transact({
      insert: { '@id': 'tom', name: 'Thomas' },
    });

    const deleteTransaction = (id) => client.transact({
        delete: {'@id': id}
    })

    const addItem = (id,name) => {
        client.transact({insert: {'@id': id, name}}).send()
            .then(res => {
                getItems()
                setDrawer(e=>({...e, open:false}))
            })
    }

    const deleteItem = (id, name) => {
        client.transact({delete: {'@id': id, name}}).send()
            .then(res => {
                getItems()
            })
    }

    const updateItem = (id,name) => {

    }

    const getItems = () => {
      queryInstance.send()
       .then(res => {
            setItems(res)
            console.log(res)
       })
    }

    useEffect(() => {
        getItems()
    }, []);

    usePageView();


    const formik = useFormik({
        initialValues: {
            '@id': drawer.item?.['@id'] || '',
            name: drawer.item?.name || ''
        },
        validationSchema: Yup.object({
            "@id": Yup
                .string()
                .max(255)
                .required('@Id is required'),
            name: Yup.string().max(255).required('Name is required')
        }),
        onSubmit: async (values, helpers) => {
            addItem(values['@id'],values.name)
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
                    <Button onClick={()=>setDrawer({open: true})}>Add item</Button>

                </Stack>
                <Card>
                    <ListTable
                        onEdit={(item) => setDrawer({open:true, item})}
                        onDelete={(item) => deleteItem(item["@id"],item.name)}
                        items={items}
                        sectionApi={sectionApi}/>
                </Card>
            </Stack>
            <Drawer
                anchor='right'
                open={drawer.open}
                onClose={() => setDrawer({})}>
                <form onSubmit={formik.handleSubmit}
                     >
                    <Card>
                        <CardHeader title={drawer.item ? 'Edit' : 'Create'}/>
                        <Stack direction='column'
                               gap={3}>
                            <Typography></Typography>
                            <FormTextField formik={formik}
                                           name="@id"
                                           label="Id"/>
                              <FormTextField formik={formik}
                                   name="name"
                                   label="Name"/>
                        </Stack>
                    </Card>
                    <Button type='submit'>Save</Button>
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
