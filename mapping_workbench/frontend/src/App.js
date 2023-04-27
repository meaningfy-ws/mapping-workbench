import { Routes, Route } from 'react-router-dom';

import Dashboard from './routes/dashboard/dashboard.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import ProjectManagement from './routes/project-management/project-management.component';
import TedRdfMapping from './routes/project-management/ted-rdf-mapping/ted-rdf-mapping.component';
import RdfFingerPrintWS from './routes/project-management/rdf-fingerprinter-ws/rdf-fingerprint-ws.component';
import MWB from './routes/project-management/mapping-workbench/mapping-workbench.component';
import NewProject from './routes/project-management/new-project/new-project.component';

const App = () => {
  
  return (
    <Routes>
      <Route path='/' element={<Navigation/>}>
        <Route index element={<Dashboard />}/>
        <Route path='auth' element={<Authentication />}/>
        <Route path='project-management' element={<ProjectManagement />}>
          <Route path='ted-rdf-mapping' element={<TedRdfMapping />}/>
          <Route path='rdf-fingerprinter-ws' element={<RdfFingerPrintWS />}/>
          <Route path='mapping-workbench' element={<MWB />}/>
          <Route path='new-project' element={<NewProject />}/>
        </Route>
      </Route>
           
    </Routes>
  );

}

export default App;
