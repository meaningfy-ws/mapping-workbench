import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import {DataGrid} from '@mui/x-data-grid';

import {usePageView} from 'src/hooks/use-page-view';
import {useItemsStore} from 'src/hooks/use-items-store';
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';
import {ListItemActions} from '../../../components/app/list/list-item-actions';
import {ForListItemAction} from '../../../contexts/app/section/for-list-item-action';


const OntologyNamespaces = () => {
        const itemsStore = useItemsStore(sectionApi);

        usePageView();

        const columns = [
            {field: 'prefix', headerName: 'Prefix', width: 90},
            {field: 'uri', headerName: 'URI', flex: 1},
            {
                field: 'is_syncable',
                headerName: 'Syncable',
                width: 140,
                renderCell: ({row}) =>
                    <Switch
                        disabled
                        checked={row.is_syncable}
                        value={row.is_syncable}
                    />
            },
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
        ];


        return (
            <Stack spacing={5}>
                <Typography variant="h5">
                    Discovered Namespaces
                </Typography>
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
    }
;

export default OntologyNamespaces;
