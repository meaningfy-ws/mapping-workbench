import { Outlet } from 'react-router-dom';
import './project-management.component.scss';


const ProjectManagement = () => {        

    return (

        <div className="mapping-workbench-projectManagement-container">
            <h1 className='page-title'>Project Management Test</h1>
            <Outlet />            
        </div>
    )
}

export default ProjectManagement;