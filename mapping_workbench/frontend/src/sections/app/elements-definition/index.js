import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'Define',
        value: paths.app.fields_and_nodes.develop.index
    },
    {
        label: 'Tree View',
        value: paths.app.fields_and_nodes.tree_view.index
    },
    {
        label: 'Overview',
        value: paths.app.fields_and_nodes.overview.index
    }]

export const ElementsDefinitionTabs = () => {
    const router = useRouter()
    const handleTabsChange = (event, value) => router.push(value)

    return <Tabs value={router.pathname}
                 onChange={handleTabsChange}>
        {TABS.map(tab => <Tab key={tab.value}
                              label={tab.label}
                              value={tab.value}/>)}
    </Tabs>
}