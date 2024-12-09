import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'Source Files',
        value: paths.app.test_data_suites.index
    }, {
        label: 'Ontology Files',
        value: paths.app.ontology_files.index
    },
    {
        label: 'Ontology Terms',
        value: paths.app.ontology_terms.index
    }, {
        label: 'Namespaces',
        value: paths.app.ontology_namespaces.index
    }]

export const SourceAndTargetTabs = () => {
    const router = useRouter()
    const handleTabsChange = (event, value) => router.push(value)

    return <Tabs value={router.pathname}
                 onChange={handleTabsChange}>
        {TABS.map(tab => <Tab key={tab.value}
                              label={tab.label}
                              value={tab.value}/>)}
    </Tabs>
}