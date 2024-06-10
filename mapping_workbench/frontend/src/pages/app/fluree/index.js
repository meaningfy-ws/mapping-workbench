import {useEffect, useState} from "react";
import { FlureeClient } from '@fluree/fluree-client';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import Typography from '@mui/material/Typography';

import {flureeApi as sectionApi} from 'src/api/fluree';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {ListTable} from "src/sections/app/fluree/list-table";

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


    useEffect(() => {

       queryInstance.send()
    .then(res => {
        setItems(res)
        console.log(res)
    })
    }, []);

const getDate = ( ) => {

       queryInstance.send()
    .then(res => {
        setItems(res)
        console.log(res)
    })
}

    usePageView();

    // console.log(txn)

    const onInsert = () => transaction.send()

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
                    <Button onClick={onInsert}>Click</Button>
                    <Button onClick={getDate}>Get</Button>
                    <Button onClick={()=>setDrawer({open: true})}>Add item</Button>

                </Stack>
                <Card>
                    <ListTable
                        onEdit={(item) => setDrawer({open:true, item})}
                        items={items}
                        sectionApi={sectionApi}/>
                </Card>
            </Stack>
            <Drawer
                anchor='right'
                open={drawer.open}
                onClose={() => setDrawer({})}>
                <Card>
                    <Stack direction='column'
                           gap={3}>
                        <Typography>{drawer.item ? 'Edit' : 'Create'}</Typography>
                        <TextField
                            label="@id"
                            value={drawer.item?.['@id']}/>
                        <TextField
                            label="Name"
                            value={drawer.item?.name}/>
                    </Stack>
                </Card>
                <Button>Save</Button>
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
