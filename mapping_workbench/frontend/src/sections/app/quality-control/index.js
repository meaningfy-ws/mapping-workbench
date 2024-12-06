import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'SPARQL Suites',
        value: paths.app.sparql_test_suites.index
    },
    {
        label: 'SHACL Suites',
        value: paths.app.shacl_test_suites.index
    }]

export const QualityControlTabs = () => {
    const router = useRouter()
    const handleTabsChange = (event, value) => router.push(value)

    return <Tabs value={router.pathname}
                 onChange={handleTabsChange}>
        {TABS.map(tab => <Tab key={tab.value}
                              label={tab.label}
                              value={tab.value}/>)}
    </Tabs>
}