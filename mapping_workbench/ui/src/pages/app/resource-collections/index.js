import {useCallback, useEffect, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {resourceCollectionsApi as sectionApi} from 'src/api/resource-collections';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {useMounted} from 'src/hooks/use-mounted';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {FileCollectionListSearch} from 'src/sections/app/file-manager/file-collection-list-search';
import {FileCollectionListTable} from 'src/sections/app/file-manager/file-collection-list-table';

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: 0,
        rowsPerPage: 5
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters
        }));
    }, []);

    const handlePageChange = useCallback((event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, []);

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

const useItemsStore = (searchState) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const response = await sectionApi.getItems(searchState);
            if (isMounted()) {
                setState({
                    items: response.items,
                    itemsCount: response.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

const Page = () => {
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    { sectionApi.SECTION_TITLE }
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
                                    <Link
                                        color="text.primary"
                                        component={RouterLink}
                                        href={paths.app[sectionApi.section].index}
                                        variant="subtitle2"
                                    >
                                        { sectionApi.SECTION_TITLE }
                                    </Link>
                                    <Typography
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        List
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
                                            <PlusIcon/>
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                >
                                    Add
                                </Button>
                            </Stack>
                        </Stack>
                        <Card>
                            <FileCollectionListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
                            <FileCollectionListTable
                                onPageChange={itemsSearch.handlePageChange}
                                onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                                page={itemsSearch.state.page}
                                items={itemsStore.items}
                                count={itemsStore.itemsCount}
                                rowsPerPage={itemsSearch.state.rowsPerPage}
                                sectionApi={sectionApi}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>

            /////////////////////////////////////////////////////////

            {/* <div className="mapping-workbench-resources">

            <h2 className='page-title'>Resources</h2>

            <FormControl sx={{ m: 1, width: 350, marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', marginBottom: '40px' }}>
                <InputLabel id="demo-multiple-chip-label">Collections</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Collection" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                MenuProps={MenuProps}
                >
          {testCollections.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

            <Box sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "20px",
                    backgroundColor: "#ebefff",
                    padding: "20px",                    
                    marginLeft: "auto",
                    marginRight: "auto",
                    minWidth: "50%",
                    marginBottom: "50px" 
                    }}
            >
                <List>
                    {arrayOfUploadedFiles.map((listElem) => (
                        <ListItem sx={{ border: "1px solid #9da4ae", borderRadius: '20px', marginTop: '10px'}} key={listElem.id}>
                            <ListItemButton sx={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} onClick={(e)=>handleDocumentClick(listElem)} >                                
                                <ListItemText primary={listElem.name} /> 
                                <ListItemText secondary={listElem.description} />                               
                            </ListItemButton>                               
                            
                            <ListItemButton sx={{ display: "flex", justifyContent: "flex-end" }} onClick={(e) => handleDeleteClick(listElem)}>                                
                                <DeleteIcon />                                
                            </ListItemButton>
                            <Divider/>                            
                        </ListItem>
                        
                    ))}                    
                </List>

                
                <input
                    accept=".csv, .json"                
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">                    
                    <Button 
                        sx={{ display: "flex" }}
                        variant="contained" 
                        component="span"                       
                    >
                        <UploadFileIcon sx={{ marginRight: "10px" }} />
                        Upload resource file
                    </Button>
                </label>
            
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>               
            <Box 
                position="absolute"
                top="25%"
                left="30%"
                sx={{ 
                    bgcolor: "#ebefff",
                    minWidth: "40%",
                    minHeight: "50%",
                    borderRadius: "20px",
                    padding: "60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"                    
                }}
            >
                <Box>
                    <Typography sx={{
                        marginTop: "20px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",                                    
                    }}
                    >
                        Resource Details
                    </Typography>
                </Box>

                

                <Box sx={{ 
                        display: "flex",                        
                        justifyContent:"center",                        
                        }}>
                        
                    <div className='editFormContainer'> 
                        <FormLabel sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginLeft: "20px",                                
                                    marginBottom: "20px",
                                    fontWeight: "bold",
                                    fontSize: "20px"
                                    }}
                        >
                            
                        </FormLabel>   
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Resource name" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Resource description" multiline maxRows={5} variant='outlined' />
                        </ListItem>                        
                    </div>           
                    
                </Box>               

                
                <Box sx={{ 
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:"space-between",                        
                        }}>
                    <Button className='button-container' onClick={() => setOpen(false)}>
                        Submit
                    </Button>                            
                    <Button className='button-container' onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Box>

            </Box>
            
        </Modal>           

        <Box sx={{ overflow: 'auto', zIndex: '1' }}>            
            <Drawer
                    anchor='left' 
                    variant='permanent'
                    sx={{ 
                        justifyContent: 'center',
                        [`& .MuiDrawer-paper`]: {
                            display: 'flex', 
                            width: '279px',
                            alignItems: 'center',                            
                            color: '#9DA4AE',                            
                            backgroundColor: '#111927' 
                        }
                    }}                    
                >                    
                    <List>
                        <Typography variant='body1' style={{fontSize: '18px', fontWeight:'700', borderBottom: '1px solid #9da4ae' }}>
                            Project Management
                        </Typography>
                        <br/>
                        <ListItemButton onClick={(e) => handleMenuClick('Packages')}>                                    
                            <ListItemIcon>
                                <FolderOpenIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px', fontWeight:'700' }}>
                                    Packages
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Resources')}>                                    
                            <ListItemIcon>                                
                                <HubIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Resources
                                </Typography>}/>       
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Target Ontology')}>                                    
                            <ListItemIcon>                                
                                <HiveIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Target Ontology
                                </Typography>}/>       
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Test Data')}>                                    
                            <ListItemIcon>                               
                                <BiotechIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Test Data
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Shacl UT')}>                                    
                            <ListItemIcon>                                
                                <ContentCutIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Shacl UT
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Sparql UT')}>                                    
                            <ListItemIcon>                                
                                <FlareIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Sparql UT
                                </Typography>}/>
                        </ListItemButton>
                        <br />
                        <ListItemButton onClick={(e) => handleMenuClick('Conceptual Mapping')}>                                    
                            <ListItemIcon>                                
                                <MapIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Conceptual Mapping
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Triple Map Fragment Management')}>                                    
                            <ListItemIcon>                                
                                <SchemaIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Triple Map Fragment Management
                                </Typography>}/>
                        </ListItemButton>                            
                    </List>
                </Drawer>
            </Box>
                     
        </div> */}
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
