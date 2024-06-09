import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {flureeApi as sectionApi} from 'src/api/fluree';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import { FlureeClient } from '@fluree/fluree-client';
import {ListTable} from "../../../sections/app/fluree/list-table";
import {useEffect, useState} from "react";

const client = await new FlureeClient({
  isFlureeHosted: true,
  apiKey: 'qjP6uJ9O7j30JAVShPh-T5x4UbGj7OZxfTd4dqT7KnEmAY-Ylf8e2tU6YwOTtSHjLZhKSGvpZKfW4T73oYvSgw',
  ledger: 'fluree-jld/387028092978552',
}).connect();

const Page = () => {

    const [items, setItems ] = useState([])

const queryInstance = client.query({
  "where": {
    "@id": "freddy"
  },
  "select": "?s",
  "from": "fluree-jld/387028092978552"
});

const transaction = client.transact({
  insert: { '@id': 'freddy', name: 'Freddy' },
});
//
// const response = queryInstance.send()
//     .then(res => {
//         setItems(res)
//         console.log(res)
//     })


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

                </Stack>
                <Card>
                    <ListTable
                        items={items}
                        sectionApi={sectionApi}/>
                </Card>
            </Stack>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
