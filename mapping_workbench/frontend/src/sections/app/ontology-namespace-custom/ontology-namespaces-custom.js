import AddIcon from '@mui/icons-material/Add';

import {DataGrid} from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {RouterLink} from 'src/components/router-link';
import {ontologyNamespacesCustomApi as sectionApi} from 'src/api/ontology-namespaces-custom';
import {ListItemActions} from '../../../components/app/list/list-item-actions';
import {ForListItemAction} from '../../../contexts/app/section/for-list-item-action';
import {useItemsStore} from '../../../hooks/use-items-store';

const OntologyNamespacesCustom = () => {
    const itemsStore = useItemsStore(sectionApi);

    const columns = [
        {field: 'prefix', headerName: 'Prefix', width: 90},
        {field: 'uri', headerName: 'URI', flex: 1},
        {
            field: 'id',
            headerName: 'Action',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: ({id}) => <ListItemActions
                itemctx={new ForListItemAction(id, sectionApi)}
                onDeleteAction={() => handleDeleteAction(id)}
            />
        },
    ]

    return (
        <Stack spacing={4}>
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
            >
                <Stack spacing={1}>
                    <Typography variant="h5">
                        {sectionApi.SECTION_TITLE}
                    </Typography>
                </Stack>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={3}
                >
                    <Button
                        id="add_namespace_button"
                        component={RouterLink}
                        href={paths.app[sectionApi.section].create}
                        startIcon={(
                            <SvgIcon>
                                <AddIcon/>
                            </SvgIcon>
                        )}
                        variant="contained"
                    >
                        Add Namespace
                    </Button>
                </Stack>
            </Stack>
            <Card>
                <DataGrid
                    getRowId={row => row._id}
                    row
                    rows={itemsStore.items}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20, 100]}
                    disableRowSelectionOnClick
                />
            </Card>
        </Stack>
    )
};

export default OntologyNamespacesCustom;
