import Chip from '@mui/material/Chip';
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import {DataGrid} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";

import {useItemsStore} from 'src/hooks/use-items-store';
import {ontologyTermsApi as sectionApi} from "src/api/ontology-terms";
import {ListItemActions} from '../../../components/app/list/list-item-actions';
import {ForListItemAction} from '../../../contexts/app/section/for-list-item-action';

const OntologyTerms = () => {
    const itemsStore = useItemsStore(sectionApi);


    const columns = [
        {
            field: 'short_term', headerName: 'Term', width: 90,
            renderCell: ({row}) =>
                <Tooltip title={row.term}>
                    <Chip label={row.short_term}
                          variant="outlined"/>
                </Tooltip>

        },
        {field: 'type', headerName: 'Type', flex: 1},
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
            <Typography variant='h5'>Terms</Typography>
            <Card>
                <DataGrid
                    getRowId={row => row._id}
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

export default OntologyTerms