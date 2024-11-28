import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import EditIcon from '@untitled-ui/icons-react/build/esm/Edit05';
import {useEffect, useState} from 'react';
import {conceptualMappingRulesApi} from '../../../../api/conceptual-mapping-rules';
import {sessionApi} from '../../../../api/session';
import {sparqlTestFileResourcesApi} from '../../../../api/sparql-test-suites/file-resources';
import {toastSuccess} from '../../../../components/app-toast';
import {ListSelectorSelect as ResourceListSelector} from '../../../../components/app/list-selector/select';
import {useDialog} from '../../../../hooks/use-dialog';

export const ListTableSPARQLAssertions = (props) => {
    const {
        item,
        isCurrent,
        isHovered,
        initProjectSPARQLResources = null
    } = props;

    const ruleFilteredSparqlResources = (item.sparql_assertions ?? []).map(x => x.id);
    const [sparqlResources, setSparqlResources] = useState(ruleFilteredSparqlResources);
    const [projectSPARQLResources, setProjectSPARQLResources] = useState(initProjectSPARQLResources ?? []);
    const [tempSparqlResources, setTempSparqlResources] = useState(ruleFilteredSparqlResources)

    useEffect(() => {
        if (initProjectSPARQLResources === null) {
            sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions()
                .then(res => setProjectSPARQLResources(res))
                .catch(err => console.error(err))
        }
    }, [])

    const sparqlTestFileResourcesDialog = useDialog();

    const handleSparqlTestFileResourcesUpdate = async () => {
        const values = {}
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['sparql_assertions'] = tempSparqlResources;
        await conceptualMappingRulesApi.updateItem(values);
        setSparqlResources(tempSparqlResources);
        item.sparql_assertions = tempSparqlResources.map(x => ({id: x}));
        toastSuccess(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        sparqlTestFileResourcesDialog.handleClose();
    }

    const sparqlResourcesForSelector = function (filters = {}) {
        return sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions(filters);
    }

    const sparqlTestFileResourcesDialogHandleClose = () => {
        sparqlTestFileResourcesDialog.handleClose();
        setTempSparqlResources(ruleFilteredSparqlResources);
    }

    const ruleSPARQLResources = projectSPARQLResources.filter(x => sparqlResources.includes(x.id))

    return (
        <Box sx={{position: 'relative'}}>
            {ruleSPARQLResources.length > 0 && (
                <Box>
                    {ruleSPARQLResources.map(r => <ListItem key={`sparql_resource_${r.id}`}>{r.title}</ListItem>)}
                </Box>
            )}
            <Box sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
            }}>
                {isHovered && <Button
                    aria-describedby={"sparql_assertions_" + item._id}
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={sparqlTestFileResourcesDialog.handleOpen}
                    component={Link}
                    sx={{
                        marginLeft: "-50%",
                        marginTop: "-50%"
                    }}
                >
                    <SvgIcon fontSize="small">
                        <EditIcon/>
                    </SvgIcon>
                </Button>}
            </Box>
            <Dialog
                id={"sparql_assertions_" + item._id}
                onClose={sparqlTestFileResourcesDialogHandleClose}
                open={sparqlTestFileResourcesDialog.open}
                fullWidth
                maxWidth="sm"
            >
                <Stack
                    spacing={3}
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography variant="h6">
                        SPARQL Assertions
                    </Typography>
                    <Box
                        spacing={3}>
                        <ResourceListSelector
                            valuesApi={sparqlTestFileResourcesApi}
                            listValues={tempSparqlResources}
                            initProjectValues={projectSPARQLResources}
                            titleField="title"
                            valuesForSelector={sparqlResourcesForSelector}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={handleSparqlTestFileResourcesUpdate}
                    >
                        Update
                    </Button>
                </Stack>
            </Dialog>
        </Box>
    )
}