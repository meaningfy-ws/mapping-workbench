import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import TreeView from "src/sections/app/tree-view/tree-view";
import {fieldsRegistryApi as sectionApi} from 'src/api/fields-registry';
import {ElementsDefinitionTabs} from 'src/sections/app/elements-definition';

export const Page = () => {
    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TREE_TITLE} List`}/>
            <Stack spacing={4}>
               <Stack>
                   <ElementsDefinitionTabs/>
               </Stack>
                <Card>
                    <TreeView sectionApi={sectionApi}/>
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
