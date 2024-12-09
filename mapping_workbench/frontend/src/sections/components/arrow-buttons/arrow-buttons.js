import ArchiveIcon from '@mui/icons-material/Archive';
import DvrIcon from '@mui/icons-material/Dvr';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import VerifiedIcon from '@mui/icons-material/Verified';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {paths} from '../../../paths';

const ArrowButton = ({children, id, icon, style, active, href = '#', first, last}) => {
    return <Link id={id}
                 href={href}>
        <button style={style}
                className={`btn-arrow btn-arrow-right ${active ? 'active' : ''} ${first ? 'first' : ''} ${last ? 'last' : ''}`}>
            <span style={{display: 'flex', alignItems: 'center'}}>{icon}{children}</span>
        </button>
    </Link>
}

const ArrowButtonGroup = ({
                              children
                          }) => {
    return <div className={'btn-group'}>
        {children}
    </div>
}

const SOURCE_AND_TARGET = ['ontology-terms', 'ontology-files', 'namespaces', 'test-data-suites']
const TECHNICAL_MAPPINGS = ['triple-map-fragments', 'value-mapping-resources']
const QUALITY_CONTROL = ['sparql-test-suites', 'shacl-test-suites']

export const ArrowButtons = () => {
    const router = useRouter()
    return (<ArrowButtonGroup>
        <ArrowButton id='source_and_target'
                     active={SOURCE_AND_TARGET.some(snt => router.pathname.includes(snt))}
                     href={paths.app.test_data_suites.index}
                     icon={<ModeStandbyIcon fontSize='small'
                                            style={{marginRight: '4px'}}/>}
                     first>
            Source & Target
        </ArrowButton>
        <ArrowButton id='elements_definition'
                     active={router.pathname.includes('fields-and-nodes')}
                     icon={<InsertDriveFileIcon fontSize='small'
                                                style={{marginRight: '4px'}}/>}
                     href={paths.app.fields_and_nodes.develop.index}>
            Elements Definition
        </ArrowButton>
        <ArrowButton id='conceptual_mappings'
                     active={router.pathname.includes('conceptual-mapping-rules')}
                     icon={<LightbulbCircleIcon fontSize='small'
                                                style={{marginRight: '4px'}}/>}
                     href={paths.app.conceptual_mapping_rules.develop.index}>
            Conceptual Mappings
        </ArrowButton>
        <ArrowButton id='technical_mappings'
                     active={TECHNICAL_MAPPINGS.some(tm => router.pathname.includes(tm))}
                     icon={<DvrIcon fontSize='small'
                                    style={{marginRight: '4px'}}/>}
                     href={paths.app.triple_map_fragments.index}>
            Technical Mappings
        </ArrowButton>
        <ArrowButton id='quality_control'
                     active={QUALITY_CONTROL.some(qc => router.pathname.includes(qc))}
                     icon={<VerifiedIcon fontSize='small'
                                         style={{marginRight: '4px'}}/>}
                     href={paths.app.sparql_test_suites.index}>
            Quality Control
        </ArrowButton>
        <ArrowButton id='export_mapping'
                     active={router.pathname.includes('mapping-packages')}
                     icon={<ArchiveIcon fontSize='small'
                                        style={{marginRight: '4px'}}/>}
                     href={paths.app.mapping_packages.index}
                     last>
            Export Mapping
        </ArrowButton>
    </ArrowButtonGroup>)
}