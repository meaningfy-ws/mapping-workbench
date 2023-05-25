import { Routes, Route } from 'react-router-dom';

import Dashboard from './routes/dashboard/dashboard.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import ProjectManagement from './routes/project-management/project-management.component';
import TedRdfMapping from './routes/project-management/ted-rdf-mapping/ted-rdf-mapping.component';
import NewProject from './routes/project-management/new-project/new-project.component';
import Resources from './routes/project-management/resources/resources.component';
import ShaclUT from './routes/project-management/shaclUT/shaclUT.component';
import SparqlUT from './routes/project-management/sparqlUT/sparqlUT.component';
import TestData from './routes/project-management/test-data/test-data.component';
import Packages from './routes/project-management/packages/packages.component';

const App = () => {
  
  return (
    <Routes>
      <Route path='/' element={<Navigation/>}>
        <Route index element={<Dashboard />}/>
        <Route path='auth' element={<Authentication />}/>
        <Route path='project-management' element={<ProjectManagement />}>
          <Route path='resources' element={<Resources />}/>
          <Route path='shacl' element={<ShaclUT />}/>
          <Route path='sparql' element={<SparqlUT />}/>
          <Route path='test-data' element={<TestData />}/>
          <Route path='ted-rdf-mapping' element={<TedRdfMapping />}/>
          <Route path='packages' element={<Packages />}/>          
          <Route path='new-project' element={<NewProject />}/>
        </Route>
      </Route>
           
    </Routes>
  );

}

export default App;
