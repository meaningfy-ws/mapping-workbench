
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {turtle} from 'codemirror-lang-turtle';
import CodeMirror from '@uiw/react-codemirror';
import {githubDark, githubLight} from '@uiw/codemirror-themes-all';

import UploadIcon from '@mui/icons-material/Upload';

import {Box} from "@mui/system";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import SvgIcon from '@mui/material/SvgIcon';
import {useTheme} from "@mui/material/styles";
import Grid from '@mui/material/Unstable_Grid2';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";

import {Seo} from 'src/components/seo';
import {sessionApi} from "src/api/session";
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {ontologyTermsApi} from "src/api/ontology-terms";
import useItemsSearch from 'src/hooks/use-items-search';
import {ItemList} from "src/sections/app/files-form/item-list";
import {ItemSearch} from 'src/sections/app/files-form/item-search';
import {ontologyFilesApi as sectionApi} from 'src/api/ontology-files';
import {FileUploader} from 'src/sections/app/files-form//file-uploader';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {ontologyFileResourcesApi as fileResourcesApi} from "src/api/ontology-files/file-resources";
import {paths} from '../../../paths';


const TABS = [{label: 'Source Files', value: 'test_data_suites'}, {label: 'Ontology Files', value: 'ontology_files'},
    {label: 'Ontology Terms', value: 'ontology_terms'}, {label: 'Namespaces', value: 'ontology_namespaces'}]

const Page = () => {
    const [view, setView] = useState('grid');
    const [state, setState] = useState([])

    const uploadDialog = useDialog();
    const detailsDialog = useDialog();
    const itemsSearch = useItemsSearch(state, sectionApi, ['filename', 'content']);

    const theme = useTheme();

    const router = useRouter();

    usePageView();

    useEffect(() => {
        handleItemsGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDiscover = () => {
        const toastId = toastLoad('Discovering terms ...')
        ontologyTermsApi.discoverTerms()
            .then(res => {
                toastSuccess(`${res.task_name} successfully started.`, toastId)
            })
            .catch(err => toastError(`Discovering terms failed: ${err.message}.`, toastId))
    };

    const handleItemsGet = () => {
        sectionApi.getOntologyFiles()
            .then(res => setState(res))
            .catch(err => console.error(err));
    }

    const afterFileUpload = () => {
        handleItemsGet()
        handleDiscover()
    }

    const handleItemGet = (name) => {
        detailsDialog.handleOpen({load: true, fileName: name})
        sectionApi.getOntologyFile(name)
            .then(res => detailsDialog.handleOpen({content: res.content, fileName: res.filename}))
            .catch(err => console.log(err));
    }

    const handleTabsChange = (event, value) => {
        return router.push(paths.app[value].index)
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE}`}/>
            <Grid container
                  spacing={{xs: 3, lg: 4}}
            >
                <Grid xs={12}>
                    <Tabs value={'ontology_files'}
                          onChange={handleTabsChange}>
                        {TABS.map(tab => <Tab key={tab.value}
                                              label={tab.label}
                                              value={tab.value}/>)}
                    </Tabs>
                </Grid>
                <Grid xs={12}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <ItemSearch
                            onFiltersChange={e => itemsSearch.handleSearchItems([e])}
                            onSortChange={itemsSearch.handleSortChange}
                            onViewChange={setView}
                            sortBy={itemsSearch.state.sortBy}
                            sortDir={itemsSearch.state.sortDir}
                            view={view}
                        />
                        <Button
                            id='import_button'
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <SvgIcon>
                                    <UploadIcon/>
                                </SvgIcon>
                            )}
                            variant="text"
                        >
                            Add ontology file
                        </Button>
                    </Stack>
                </Grid>
                <Grid xs={12}>
                    <Stack spacing={{xs: 3, lg: 4}}>
                        <ItemList
                            count={itemsSearch.count}
                            items={itemsSearch.pagedItems}
                            collection={sessionApi.getSessionProject()}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            view={view}
                            sectionApi={sectionApi}
                            fileResourcesApi={fileResourcesApi}
                            onGetItems={handleItemsGet}
                            onViewDetails={handleItemGet}
                        />
                    </Stack>
                </Grid>
            </Grid>

            <Dialog
                open={detailsDialog.open}
                onClose={detailsDialog.handleClose}
                fullWidth
                maxWidth='xl'
            >
                <DialogTitle>
                    {detailsDialog.data?.fileName}
                </DialogTitle>
                <DialogContent>
                    {detailsDialog.data?.load ?
                        <Box sx={{display: 'flex', justifyContent: 'center', marginY: 10}}>
                            <CircularProgress/>
                        </Box> :
                        <CodeMirror
                            theme={theme.palette.mode === 'dark' ? githubDark : githubLight}
                            style={{resize: 'vertical', overflow: 'auto'}}
                            value={detailsDialog.data?.content}
                            editable={false}
                            extensions={[turtle()]}
                        />}
                </DialogContent>
            </Dialog>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                onGetItems={afterFileUpload}
                sectionApi={fileResourcesApi}
                onlyAcceptedFormats
                disableSelectFormat
            />
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;