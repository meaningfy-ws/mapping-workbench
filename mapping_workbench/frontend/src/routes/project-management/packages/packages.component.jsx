
import { Avatar, Button, Box, Drawer, List, ListItemButton, ListItemText, ListItemAvatar, Typography, ListItemIcon, ListItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import './packages.component.scss';

const arrMenuOptions = ['PACKAGES', 'TEST DATA', 'RESOURCES', 'SHACL UT', 'SPARQL UT'];

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'packageTitle',
      headerName: 'Package title',
      width: 150,
      editable: true,
    },
    {
      field: 'packageDescription',
      headerName: 'Package description',
      width: 150,
      editable: true,
    },
    {
      field: 'formType',
      headerName: 'Form type(s)',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'minDate',
      headerName: 'Min date',
      type: 'date',            
      width: 160,
      valueGetter: ({ value }) => value && new Date(value),
      editable: true,      
    },
    {
        field: 'maxDate',
        headerName: 'Max date',
        type: 'date',            
        width: 160,
        valueGetter: ({ value }) => value && new Date(value),
        editable: true,      
    },
    {
        field: 'minVersion',
        headerName: 'Min version',
        width: 150,
        editable: true,
    },
    {
        field: 'maxVersion',
        headerName: 'Max version',
        width: 150,
        editable: true,
    },
  ];
  
  const rows = [
    { id: 1, packageDescription: 'Des03', packageTitle: 'F03', formType: 35, minDate: 19811125, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 2, packageDescription: 'Des02', packageTitle: 'F02', formType: 42, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 3, packageDescription: 'Des01', packageTitle: 'F01', formType: 45, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 4, packageDescription: 'Des04', packageTitle: 'F04', formType: 16, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 5, packageDescription: 'Des05', packageTitle: 'F05', formType: 11, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 6, packageDescription: 'Des06', packageTitle: 'F06', formType: 150, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 7, packageDescription: 'Des07', packageTitle: 'F07', formType: 44, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 8, packageDescription: 'Des08', packageTitle: 'F08', formType: 36, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 9, packageDescription: 'Des09', packageTitle: 'F09', formType: 65, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
  ];

const Packages = () => {    

    const navigate = useNavigate();

    const handleMenuClick = (menuOption) => {
    
        switch(menuOption) {
            case 'RESOURCES':
                navigate("/project-management/resources");
                    
                break;
            case 'TEST DATA':
                navigate("/project-management/test-data");                
                
                break;
            case 'PACKAGES':
                navigate("/project-management/packages");                
                    
                break;
            default:
                break;                    
        }
    }

    return (

        <div className="mapping-workbench-projectManagement-packages">
            <h2 className='page-title'>Packages</h2>


            <Box sx={{ height: 'auto', width: '75%', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#F9F6EE' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}                    
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>


            <Box sx={{ overflow: 'auto', zIndex: '1', display: 'flex', justifyContent: 'center' }}>
                <Drawer
                    anchor='left' 
                    variant='permanent'
                    sx={{ 
                        justifyContent: 'center',
                        [`& .MuiDrawer-paper`]: {
                            display: 'flex', 
                            width: '200px',
                            alignItems: 'center',                            
                            backgroundColor: '#F9F6EE' 
                        }
                    }}                                        
                >
                    <List>
                        {
                            arrMenuOptions.map((elm) => (
                                <ListItemButton key={elm}>
                                <ListItemText 
                                    
                                    disableTypography 
                                    primary={<Typography 
                                                variant="body1" 
                                                style={{
                                                        fontSize: '18px',
                                                        fontWeight:'700' 
                                                    }}
                                            >
                                                {elm}
                                            </Typography>} onClick={(e) => handleMenuClick(elm)} />
                                
        
                                </ListItemButton>
                            ))
                        }
                    </List>
                </Drawer>
            </Box>
                     
        </div>
    )
}

export default Packages;