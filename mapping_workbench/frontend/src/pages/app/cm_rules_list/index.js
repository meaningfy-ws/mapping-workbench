import {useEffect, useState} from 'react';

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
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";

const Page = () => {
    const [view, setView] = useState('grid');
    const [state, setState] = useState([])

    const uploadDialog = useDialog();
    const detailsDialog = useDialog();


    const statusCM = [
        {label: 'Under development', color: 'gray'},
        {label: 'For internal review', color: 'yellow'},
        {label: 'For internal consultation', color: 'yellow'},
        {label: 'For OP consultation', color: 'pink'},
        {label: 'For internal consultation(after review)', color: 'yellow'},
        {label: 'Approved by first internal reviewer', color: 'lightblue'},
        {label: 'Approved by second internal reviewer', color: 'lightblue'},
        {label: 'For OP review (done)',  color: 'pink'},
        {label: 'Approved by first OP reviewer', color: 'green'},
        {label: 'Approved by OP (Accepted)', color: 'greener'},
        {label: 'Change requested by OP', color: 'red'},
        {label: 'Updated based on OP review', color: 'blue'}
    ]

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
                        <Card>
                            <TextField select
                                       fullWidth>

                            </TextField>
                            <Stack direction={{xs:'column', xl:'row-reverse'}}
                                   justifyContent={{xs:'space-between'}}
                                   margin={1}>
                                <Stack direction={{xs:'row',xl:'column'}}
                                       justifyContent='center'>
                                    <TextField select
                                               sx={{backgroundColor:'red'}}
                                               label="Status"
                                               name="statusCM">
                                        {statusCM.map(status=>
                                            <MenuItem
                                                key={status.label}
                                                value={status.label}
                                            >
                                                <Typography
                                                    color="var(--nav-color)"
                                                    variant="body2"
                                                >
                                                    {status.label}
                                                </Typography>
                                            </MenuItem>
                                        )}
                                    </TextField>
                                    <Button>Editorial Notes</Button>
                                    <Button>Feedback Notes</Button>
                                    <Button>Mappings Notes</Button>
                                </Stack>
                                <Box margin={3}>

                                    <Typography>Context</Typography>
                                    <Box marginX={1}>
                                        <Typography>min/max version</Typography>
                                        <Typography>Parent ID</Typography>
                                    </Box>
                                    <Typography>Xpath expression of CM Rule</Typography>
                                    <Box marginX={1}>
                                        <Typography>Ontology Fragment</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Card>
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
