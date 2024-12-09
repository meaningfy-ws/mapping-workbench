import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'SPARQL Suites',
        value: paths.app.sparql_test_suites.index,
        id: 'sparql_suites_tab'
    },
    {
        label: 'SHACL Suites',
        value: paths.app.shacl_test_suites.index,
        id: 'shacl_suites_tab'
    }]

export const QualityControlTabs = () => {
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