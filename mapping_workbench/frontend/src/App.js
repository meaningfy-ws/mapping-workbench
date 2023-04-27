import { Routes, Route } from 'react-router-dom';

import Dashboard from './routes/dashboard/dashboard.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import ProjectManagement from './routes/project-management/project-management.component';
import NewProject from './routes/project-management/new-project/new-project.component';

const App = () => {
  
  return (
    <Routes>
      <Route path='/' element={<Navigation/>}>
        <Route index element={<Dashboard />}/>
        <Route path='auth' element={<Authentication />}/>
        <Route path='project-management' element={<ProjectManagement />}>
          <Route path='ted-rdf-mapping' element={<Authentication />}/>
          <Route path='rdf-fingerprinter-ws' element={<Authentication />}/>
          <Route path='mapping-workbench' element={<Authentication />}/>
          <Route path='new-project' element={<NewProject />}/>
        </Route>
      </Route>
           
    </Routes>
  );

}

export default App;
