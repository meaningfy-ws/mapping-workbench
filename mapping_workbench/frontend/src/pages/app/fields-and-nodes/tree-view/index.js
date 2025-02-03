import Paper from '@mui/material/Paper';

import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import TreeView from "src/sections/app/tree-view/tree-view";
import {fieldsRegistryApi as sectionApi} from 'src/api/fields-registry';
import {ElementsDefinitionTabs} from 'src/sections/app/elements-definition';
import {NavigationTabsWrapper} from 'src/components/navigation-tabs-wrapper';

export const Page = () => {
    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TREE_TITLE} List`}/>
            <NavigationTabsWrapper>
                <ElementsDefinitionTabs/>
            </NavigationTabsWrapper>
            <Paper>
                <TreeView sectionApi={sectionApi}/>
            </Paper>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
