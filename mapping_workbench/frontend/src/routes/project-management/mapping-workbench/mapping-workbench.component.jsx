import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
//import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './mapping-workbench.component.scss';

    const objTest = {
        "title": "mapping-workbench",
        "description": "Transformation rules and other artefacts for the MWB Web Services",
        "version": "2.1.2",
        "source_schema":{
        "title": "Schema Title MWB",
        "description": "Schema Description Mwb...",
        "version": "4.3.0",
        "type": "xml/json"
        },
        "target_ontology":{
        "title": "ePO",
        "description": "Description of ePO...",
        "version": "3.1.0",
        "uri": "http://data.europa.eu/a4g/ontology"
        }
    };

    const sourceSchema = objTest.source_schema;
    const targetOntology = objTest.target_ontology;

const MWB = () => {

return (
    <div className="new-project-container">
                
        <div className="project-meta-field">
            <div className="project-meta-label">
                Title: 
            </div>
            <div className="project-meta-value">
                    {objTest.title}
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Description: 
            </div>
            <div className="project-meta-value">
                {objTest.description}
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Version: 
            </div>
            <div className="project-meta-value">
                {objTest.version}
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
                            Title: {sourceSchema.title}
                        </Typography>
                        <Typography variant="h6">
                            Description: {sourceSchema.description}
                        </Typography>
                        <Typography variant="h6">
                            Version: {sourceSchema.version}
                        </Typography>
                        <Typography variant="h6">
                            Type: {sourceSchema.type}
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
                                Title: {targetOntology.title}
                            </Typography>
                            <Typography variant="h6">
                                Description: {targetOntology.description}
                            </Typography>
                            <Typography variant="h6">
                                Version: {targetOntology.version}
                            </Typography>
                            <Typography variant="h6">
                                Uri: {targetOntology.uri}
                            </Typography>
                        </CardContent>
                    </Card>
            </div>

        </div>
        
    </div>
);

}

export default MWB;