import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const TABS = [
    {
        label: 'Triple Map Fragments',
        value: paths.app.triple_map_fragments.index,
        id: 'triple_map_fragments_tab'
    },
    {
        label: 'Mapping Resources',
        value: paths.app.value_mapping_resources.index,
        id: 'value_mapping_resources_tab'
    }]

export const TechnicalMappingsTabs = () => {
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