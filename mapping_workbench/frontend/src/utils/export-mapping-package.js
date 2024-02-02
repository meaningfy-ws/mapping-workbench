import { saveAs } from 'file-saver';
import { sessionApi } from "../api/session";
import toast from "react-hot-toast";

const exportPackage = (api, package_id, setLoading, item ) => {
        setLoading(true);
        const project_id = sessionApi.getSessionProject();
        const data = {
            project_id,
            package_id,
            state_id: item._id
        }
        toast.promise(api.exportPackage(data), {
            loading: `Exporting "${item.identifier}" ... This may take a while. Please, be patient.`,
            success: (response) => {
                setLoading(false);
                saveAs(new Blob([response], {type: "application/x-zip-compressed"}), `${item.identifier} ${item._id}.zip`);
                return `"${item.identifier}" successfully exported.`
            },
            error: (err) => {
                setLoading(false);
                return `Exporting "${item.identifier}" failed: ${err.message}.`
            }
        })
    };

export default exportPackage