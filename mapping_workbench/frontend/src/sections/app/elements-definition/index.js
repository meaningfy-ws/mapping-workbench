import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'Overview',
        value: paths.app.fields_and_nodes.overview.index,
        id: 'elements_define_overview_tab'
    },
    {
        label: 'Define',
        value: paths.app.fields_and_nodes.develop.index,
        id: 'elements_define_tab'
    },
    {
        label: 'Tree View',
        value: paths.app.fields_and_nodes.tree_view.index,
        id: 'elements_define_tree_tab'
    }]

export const ElementsDefinitionTabs = () => {
    const router = useRouter()
    const handleTabsChange = (event, value) => router.push(value)

    return <Tabs value={router.pathname}
                 onChange={handleTabsChange}>
        {TABS.map(tab => <Tab key={tab.value}
                              id={tab.id}
                              label={tab.label}
                              value={tab.value}/>)}
    </Tabs>
}