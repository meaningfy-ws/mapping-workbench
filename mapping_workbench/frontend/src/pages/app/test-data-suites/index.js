import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import Box from '@mui/system/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {DataGrid} from '@mui/x-data-grid';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useDialog} from "src/hooks/use-dialog";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import {testDataSuitesApi as sectionApi} from 'src/api/test-data-suites';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {FileCollectionUploader} from "src/sections/app/file-manager/file-collection-uploader";
import {useEffect, useState} from "react";
import {mappingPackagesApi} from '../../../api/mapping-packages';
import {ListItemActions} from '../../../components/app/list/list-item-actions';
import {ForListItemAction} from '../../../contexts/app/section/for-list-item-action';
import {useGlobalState} from '../../../hooks/use-global-state';
import {TestDataSuitesResourcesDialog} from '../../../sections/app/file-manager/test-data-suites-resources-dialog';
import {
    MappingPackagesBulkAssigner
} from '../../../sections/app/mapping-package/components/mapping-packages-bulk-assigner';
import timeTransformer from '../../../utils/time-transformer';

const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
        force: 0
    });

    const handleItemsGet = (force = 0) => {
        sectionApi.getItems()
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count,
                    force: force
                }))
            .catch(err => console.error(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        handleItemsGet,
        ...state
    };
};

const Page = () => {
    const uploadDialog = useDialog()
    const listDialog = useDialog()
    const itemsStore = useItemsStore(sectionApi);

    const [selectedItems, setSelectedItems] = useState([])
    const [projectMappingPackages, setProjectMappingPackages] = useState([]);
    const [collectionResources, setCollectionResources] = useState([])

    useEffect(() => {
        mappingPackagesApi.getProjectPackages(true)
            .then(res => setProjectMappingPackages(res))
            .catch(err => console.error(err))
    }, [itemsStore.force])


    useEffect(() => {
        listDialog.data && getFileResources(listDialog.data)
    }, [listDialog.data])

    const getFileResources = (id) => {
        sectionApi.getFileResources(id, {rowsPerPage: -1})
            .then(res => setCollectionResources(res.items))
    }


    usePageView();

    const onMappingPackagesAssign = () => {
        itemsStore.handleItemsGet(Date.now())
    }

    const {timeSetting} = useGlobalState()

    const columns = [
        {
            field: 'title', headerName: 'Title', width: 90, flex: 1,
            renderCell: ({row, id}) =>
                <Box>
                    <IconButton onClick={() => listDialog.handleOpen(id)}>
                        <FormatListBulletedIcon/>
                    </IconButton>
                    {row.title}
                </Box>

        },
        {
            field: 'refers_to_mapping_package_ids', headerName: 'Packages', flex: 1,
            renderCell: ({id}) => <Box sx={{p: 0, m: 0}}>
                {
                    sectionApi.MAPPING_PACKAGE_LINK_FIELD
                    && projectMappingPackages
                        .filter(
                            projectMappingPackage => projectMappingPackage?.[sectionApi.MAPPING_PACKAGE_LINK_FIELD]
                                ?.some(resource_ref => id === resource_ref.id)
                        )
                        .map(mapping_package =>
                            <Chip
                                key={"mapping_package_" + mapping_package.id}
                                sx={{p: 0, m: 0}}
                                label={mapping_package['title']}
                            />
                        )}
            </Box>
        },
        {
            field: 'created_at', headerName: 'Created', width: 160,
            renderCell: ({row}) => timeTransformer(row.created_at, timeSetting)
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
    ]

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
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                            id="add_button"
                        >
                            Create Test Data Suite
                        </Button>
                        <Button
                            type='link'
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <SvgIcon>
                                    <UploadIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                            id="import-test-data_button"
                        >
                            Import Test Data Suites
                        </Button>

                    </Stack>
                </Stack>
                <Card>
                    <Box sx={{p: 1}}>
                        <MappingPackagesBulkAssigner
                            sectionApi={sectionApi}
                            idsToAssignTo={selectedItems}
                            initProjectMappingPackages={projectMappingPackages}
                            disabled={selectedItems.length === 0}
                            onMappingPackagesAssign={onMappingPackagesAssign}
                        />
                    </Box>
                    <Divider/>
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
                        checkboxSelection
                        onRowSelectionModelChange={setSelectedItems}
                    />
                </Card>
                <FileCollectionUploader
                    onClose={uploadDialog.handleClose}
                    open={uploadDialog.open}
                    sectionApi={sectionApi}
                />
                <TestDataSuitesResourcesDialog itemId={listDialog.data}
                                               open={listDialog.open}
                                               handleClose={listDialog.handleClose}
                                               collectionResources={collectionResources}
                                               sectionApi={sectionApi}
                />
            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
