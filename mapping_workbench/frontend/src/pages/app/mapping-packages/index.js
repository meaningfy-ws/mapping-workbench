import {useEffect, useState} from 'react';
import {saveAs} from 'file-saver';

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {sessionApi} from "src/api/session";
import {projectsApi} from 'src/api/projects';
import {useDialog} from "src/hooks/use-dialog";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {ListTable} from "src/sections/app/mapping-package/list-table";
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {PackageImporter} from 'src/sections/app/mapping-package/package-importer';
import AutorenewIcon from "@mui/icons-material/Autorenew";


const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems()
            .then(res => setState({
                items: res.items,
                itemsCount: res.count
            }))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        handleItemsGet();
    }, []);

    return {
        handleItemsGet,
        ...state
    };
};


const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['title', 'identifier', 'process_status'], {}, {
        column: 'created_at',
        sort: 'desc'
    });

    const importDialog = useDialog();
    const srcExportDialog = useDialog();

    const exportSourceFiles = () => {
        const toastId = toastLoad(`Exporting Source Files ... `)
        projectsApi.exportSourceFiles()
            .then(response => {
                const filename = `src_${sessionApi.getSessionProject()}.zip`;
                saveAs(new Blob([response], {type: "application/x-zip-compressed"}), filename);
                toastSuccess(`Source Files successfully exported.`, toastId)
            }).catch(err => toastError(`Exporting Source Files failed: ${err.message}.`, toastId))

        srcExportDialog.handleClose();
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Paper>
                        <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                        value={itemsSearch.state.search[0]}/>
                    </Paper>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="refresh_button"
                            color="inherit"
                            startIcon={<AutorenewIcon/>}
                            onClick={itemsStore.handleItemsGet}
                        >
                            Refresh
                        </Button>
                        <Button
                            onClick={srcExportDialog.handleOpen}
                            id="src_export_button"
                            startIcon={<UploadIcon/>}
                        >
                            Export SRC
                        </Button>
                        <Button
                            onClick={importDialog.handleOpen}
                            id="import_package_button"
                            startIcon={<DownloadIcon/>}
                        >
                            Import
                        </Button>
                        <Button
                            component={RouterLink}
                            id="add_package_button"
                            href={paths.app[sectionApi.section].create}
                            startIcon={<AddIcon/>}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>

                </Stack>

                <ListTable
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    items={itemsSearch.pagedItems}
                    count={itemsSearch.count}
                    onSort={itemsSearch.handleSort}
                    sort={itemsSearch.state.sort}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    sectionApi={sectionApi}
                    getItems={itemsStore.handleItemsGet}
                />
            </Stack>

            <PackageImporter
                onClose={importDialog.handleClose}
                open={importDialog.open}
                sectionApi={sectionApi}
            />
            <Dialog
                fullWidth
                maxWidth="sm"
                open={srcExportDialog.open}
                onClose={srcExportDialog.handleClose}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography variant="h6">
                        Export Source Files
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={srcExportDialog.handleClose}
                    >
                        <ClearIcon/>
                    </IconButton>
                </Stack>
                <DialogContent id="drop-zone">
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{mt: 2}}
                    >
                        <Button
                            id="upload_button"
                            onClick={exportSourceFiles}
                            size="small"
                            type="button"
                            variant="contained"
                        >
                            Export
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
