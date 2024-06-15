import {useEffect, useMemo, useState} from 'react';

import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {schemaFilesApi as sectionApi} from 'src/api/schema-files';
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {FileUploader} from 'src/sections/app/files-form//file-uploader';
import {ItemDrawer} from 'src/sections/app/file-manager/item-drawer';
import {ItemSearch} from 'src/sections/app/files-form//item-search';
import {schemaFileResourcesApi as fileResourcesApi} from "src/api/schema-files/file-resources";
import {ItemList} from "src/sections/app/files-form/item-list";
import {sessionApi} from "src/api/session";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {Box} from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";

const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {},
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE,
         sort: {
            column: "filename",
            direction: "desc"
        },
        search: '',
        searchColumns:["filename"],
    });

    const searchItems = state.search ? items.filter(item => {
        let returnItem = null;
        state.searchColumns.forEach(column => {
            if(item[column]?.toLowerCase()?.includes(state.search.toLowerCase()))
                returnItem = item
        })
        return returnItem
    }) : items


    const filteredItems = searchItems.filter((item) => {
        let returnItem = item;
        Object.entries(state.filters).forEach(filter=> {
            const [key, value] = filter
            if(value !== "" && value !== undefined && typeof item[key] === "boolean" && item[key] !== (value == "true"))
                returnItem = null
            if(value !== undefined && typeof item[key] === "string" && !item[key].toLowerCase().includes(value.toLowerCase))
                returnItem = null
        })
        return returnItem
    })

     const sortedItems = () => {
        const sortColumn = state.sort.column
        if(!sortColumn) {
            return searchItems
        } else {
            return searchItems.sort((a,b) => {
                if (typeof a[sortColumn] === "string")
                    return state.sort.direction === "asc" ?
                        a[sortColumn]?.localeCompare(b[sortColumn]) :
                        b[sortColumn]?.localeCompare(a[sortColumn])
                else
                    return state.sort.direction === "asc" ?
                        a[sortColumn] - b[sortColumn] :
                        b[sortColumn] - a[sortColumn]
                })
        }
    }

    const pagedItems = sortedItems().filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (filters) => {
        setState(prevState => ({...prevState, search: filters }))
    }


    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters
        }));
    };

    const handleSortChange = sortDir => {
        setState(prevState => ({
            ...prevState,
            sortDir
        }));
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    }

    const handleSort = (column, desc) => {
       setState(prevState=> ({ ...prevState, sort: {column,
           direction: prevState.sort.column === column
               ? prevState.sort.direction === "desc"
                   ? "asc"
                   : "desc"
               : desc
                   ? "desc"
                   : "asc"}}))
    }

    const handleRowsPerPageChange = event => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    return {
        handleFiltersChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSearchItems,
        pagedItems,
        count: filteredItems.length,
        state
    };
};

const useCurrentItem = (items, itemId) => {
    return useMemo(() => {
        if (!itemId) {
            return undefined;
        }

        return items.find((item) => item.id === itemId);
    }, [items, itemId]);
};

const Page = () => {
    const [view, setView] = useState('grid');
    const [state, setState] = useState([])

    const uploadDialog = useDialog();
    const detailsDialog = useDialog();
    const itemsSearch = useItemsSearch(state);


    usePageView();

     useEffect(() => {
        handleItemsGet();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[]);

    const handleItemsGet = () => {
         sectionApi.getXSDFiles()
             .then(res => setState(res))
             .catch(err => console.error(err));
    }

    const handleItemGet = (name) => {
         detailsDialog.handleOpen({load: true, fileName: name})
         sectionApi.getXSDFile(name)
            .then(res => detailsDialog.handleOpen({content: res.content, fileName: res.filename}))
            .catch(err => console.log(err));
    }

    return (
        <>
            <Seo title="App: Resource Manager"/>

            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4
                }}
            >
                <Grid xs={12}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <div>
                            <Typography variant="h5">
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </div>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <Button
                                onClick={uploadDialog.handleOpen}
                                startIcon={(
                                    <SvgIcon>
                                        <Upload01Icon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Upload
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid
                    xs={12}
                    md={12}
                >
                    <Stack
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <ItemSearch
                            onFiltersChange={itemsSearch.handleSearchItems}
                            onSortChange={itemsSearch.handleSortChange}
                            onViewChange={setView}
                            sortBy={itemsSearch.state.sortBy}
                            sortDir={itemsSearch.state.sortDir}
                            view={view}
                        />
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
                    {
                        detailsDialog.data?.load ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginY:10 }}>
                                <CircularProgress />
                            </Box>:
                            <SyntaxHighlighter
                                language="xml"
                                wrapLines
                                lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
                                {detailsDialog.data?.content}
                            </SyntaxHighlighter>
                    }
                </DialogContent>
            </Dialog>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                onGetItems={handleItemsGet}
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
