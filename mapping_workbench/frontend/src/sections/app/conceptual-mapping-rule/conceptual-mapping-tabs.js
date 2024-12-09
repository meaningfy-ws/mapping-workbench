import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'In development',
        value: paths.app.conceptual_mapping_rules.develop.index
    },
    {
        label: 'In review',
        value: paths.app.conceptual_mapping_rules.review.index
    },
    {
        label: 'Approved',
        value: paths.app.conceptual_mapping_rules.overview.index
    }]

export const ConceptualMappingTabs = () => {
    const router = useRouter()
    const handleTabsChange = (event, value) => router.push(value)

    return <Tabs value={router.pathname}
                 onChange={handleTabsChange}>
        {TABS.map(tab => <Tab key={tab.value}
                              label={tab.label}
                              value={tab.value}/>)}
    </Tabs>
}