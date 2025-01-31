import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'Overview',
        value: paths.app.conceptual_mapping_rules.overview.index,
        id: 'conceptual_mappings_overview_tab'
    },
    {
        label: 'In development',
        value: paths.app.conceptual_mapping_rules.develop.index,
        id: 'conceptual_mappings_develop_tab'
    },
    {
        label: 'In review',
        value: paths.app.conceptual_mapping_rules.review.index,
        id: 'conceptual_mappings_review_tab'
    }
]

export const ConceptualMappingTabs = () => {
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