import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'Source Files',
        value: paths.app.test_data_suites.index,
        id: 'source_files_tab'
    }, {
        label: 'Ontology Files',
        value: paths.app.ontology_files.index,
        id: 'ontology_files_tab'
    },
    {
        label: 'Ontology Terms',
        value: paths.app.ontology_terms.index,
        id: 'ontology_terms_tab'
    }, {
        label: 'Namespaces',
        value: paths.app.ontology_namespaces.index,
        id: 'ontology_namespaces_tab'
    }]

export const SourceAndTargetTabs = () => {
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