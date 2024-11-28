import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import Box from '@mui/system/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {DataGrid} from '@mui/x-data-grid';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {fieldsOverviewApi as sectionApi} from 'src/api/fields-overview';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ListItemActions} from '../../../../components/app/list/list-item-actions';
import {ForListItemAction} from '../../../../contexts/app/section/for-list-item-action';
import {useDialog} from '../../../../hooks/use-dialog';
import {XpathDialog} from '../../../../sections/app/fields-and-nodes/xpath-dialog';


const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems({}, null, '/fields_registry/elements')
            .then(res => setState({
                items: res.items,
                itemsCount: res.count
            }))
            .catch(err => console.error(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        ...state
    };
};


const Page = () => {
        const itemsStore = useItemsStore();
        const xPathDialog = useDialog()

        const columns = [
            {
                field: 'sdk_element_id', headerName: 'Element', width: 90, flex: 1,
                renderCell: ({row}) =>
                    <Box>
                        <IconButton onClick={() => xPathDialog.handleOpen(row)}>
                            <FormatListBulletedIcon/>
                        </IconButton>
                        {row.sdk_element_id}
                    </Box>

            },
            {
                field: 'parent_node_id', headerName: 'Parent', width: 90, flex: 1
            },
            {
                field: 'versions', headerName: 'Versions', flex: 1,
                renderCell: ({row}) => <Box sx={{p: 0, m: 0}}>
                    {
                        row.versions?.map(version =>
                            <Chip key={version}
                                  variant='outlined'
                                  sx={{p: 0, m: 0}}
                                  label={version}
                            />
                        )}
                </Box>
            },
            {
                field: 'element_type', headerName: 'Type', width: 70
            },
            {
                field: 'id',
                headerName: 'Action',
                width: 200,
                sortable: false,
                filterable: false,
                renderCell: ({id}) =>
                    <ListItemActions itemctx={new ForListItemAction(id, sectionApi)}
                                     pathnames={{
                                         delete_after_path: () => paths.app.fields_and_nodes.overview.elements,
                                         edit: () => paths.app.fields_and_nodes.overview.elements.edit(id),
                                         view: () => paths.app.fields_and_nodes.overview.elements.view(id)
                                     }}
                    />
            },
        ]

        usePageView();

        return (
            <>
                <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
                <Stack spacing={4}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h4">
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                            <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={paths.index}
                                    variant="subtitle2"
                                >
                                    App
                                </Link>
                                <Typography
                                    color="text.secondary"
                                    variant="subtitle2"
                                >
                                    {sectionApi.SECTION_TITLE}
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={3}
                        >
                            <Button
                                component={RouterLink}
                                href={paths.app.fields_and_nodes.overview.elements.create}
                                id="add-field-button"
                                startIcon={(
                                    <SvgIcon>
                                        <AddIcon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Add
                            </Button>
                            <Button
                                id="import_shema_button"
                                component={RouterLink}
                                href={paths.app.fields_and_nodes.overview.import}
                                startIcon={(
                                    <SvgIcon>
                                        <UploadIcon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Import schema from github
                            </Button>
                        </Stack>

                    </Stack>
                    <Card>
                        <DataGrid getRowId={row => row._id}
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
                <XpathDialog open={xPathDialog.open}
                             handleClose={xPathDialog.handleClose}
                             item={xPathDialog.data ?? {}}/>
            </>
        );
    }
;

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
