import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
//import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './new-project.component.scss';   

const NewProject = () => {

return (
    <div className="new-project-container">
                
        <div className="project-meta-field">
            <div className="project-meta-label">
                Title: 
            </div>
            <div className="project-meta-value">
                    
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Description: 
            </div>
            <div className="project-meta-value">
                
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Version: 
            </div>
            <div className="project-meta-value">
                
            </div>
        </div>
      
        <div className='cards-container'>

            <div className='project-source-scheme-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <b>Source Schema</b>
                        </Typography>
                        <Typography variant="h6">
                            Title: 
                        </Typography>
                        <Typography variant="h6">
                            Description: 
                        </Typography>
                        <Typography variant="h6">
                            Version: 
                        </Typography>
                        <Typography variant="h6">
                            Type: 
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            
            <div className='project-target-ontology-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <b>Target Ontology</b>
                            </Typography>
                            <Typography variant="h6">
                                Title: 
                            </Typography>
                            <Typography variant="h6">
                                Description: 
                            </Typography>
                            <Typography variant="h6">
                                Version: 
                            </Typography>
                            <Typography variant="h6">
                                Uri: 
                            </Typography>
                        </CardContent>
                    </Card>
            </div>

        </div>
        
    </div>
);

}

export default NewProject;