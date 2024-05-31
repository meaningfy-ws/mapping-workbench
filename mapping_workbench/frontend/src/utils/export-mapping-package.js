import { saveAs } from 'file-saver';
import { sessionApi } from "../api/session";
import {toastError, toastLoad, toastSuccess} from "../components/app-toast";

const exportPackage = (api, package_id, setLoading, item ) => {
        setLoading(true);
        const project_id = sessionApi.getSessionProject();
        const data = {
            project_id,
            package_id,
            state_id: item._id
        }
        const toastId = toastLoad(`Exporting "${item.identifier}" ... This may take a while. Please, be patient.`)
        api.exportPackage(data)
            .then(res => {
                saveAs(new Blob([res], {type: "application/x-zip-compressed"}), `${item.identifier}_${item._id}.zip`);
                toastSuccess(`"${item.identifier}" successfully exported.`, toastId)
            })
            .catch(err => toastError(`Exporting "${item.identifier}" failed: ${err.message}.`, toastId))
            .finally(() => setLoading(false))
    };

export default exportPackage