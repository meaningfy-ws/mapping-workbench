import {useState} from "react";
import {useRouter} from "next/router";
import PropTypes from 'prop-types';

import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


import {paths} from 'src/paths';
import {ACTION} from "../../../api/section";
import {MenuActionButton} from '../../menu-actions';

import ConfirmDialog from "../dialog/confirm-dialog";
import {toastError} from "../../app-toast";

export const ListItemActions = (props) => {
    const router = useRouter();
    const {itemctx, pathnames, onDeleteAction, confirmDialogContent, confirmDialogFooter} = props;

    const handleViewAction = () => {
        if (pathnames?.view)
            router.push(pathnames.view())
        else
            router.push({
                pathname: paths.app[itemctx.api.section].view,
                query: {id: itemctx.id}
            });
    }

    const handleEditAction = () => {
        if (pathnames?.edit)
            router.push(pathnames.edit())
        else
            router.push({
                pathname: paths.app[itemctx.api.section].edit,
                query: {id: itemctx.id}
            });

    }

    const handleDeleteAction = () => {
        itemctx.api.deleteItem(itemctx.id)
            .then(() => {
                if (pathnames?.delete_after_path)
                    router.push(pathnames.delete_after_path())
                else
                    router.push({
                        pathname: paths.app[itemctx.api.section].index
                    });
                router.reload()
            })
            .catch(err => toastError(err))
    }

    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.VIEW) && <MenuActionButton
                id="view_button"
                onClick={handleViewAction}
                icon={<VisibilityIcon/>}
                title='View'
            />}
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.EDIT) && <MenuActionButton
                id="edit_button"
                onClick={handleEditAction}
                icon={<BorderColorIcon/>}
                title='Edit'
            />}
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.DELETE) && <>
                <MenuActionButton
                    id="delete_button"
                    last
                    onClick={() => setConfirmOpen(true)}
                    icon={<DeleteOutlineIcon/>}
                    title='Delete'
                />
                <ConfirmDialog
                    title="Delete It?"
                    open={confirmOpen}
                    setOpen={setConfirmOpen}
                    onConfirm={onDeleteAction ?? handleDeleteAction}
                    footer={confirmDialogFooter}
                >
                    <>Are you sure you want to delete it?</>
                    <>{confirmDialogContent}</>
                </ConfirmDialog>
            </>}
        </>
    );
};


ListItemActions.propTypes = {
    itemctx: PropTypes.object,
    pathnames: PropTypes.object,
    onDeleteAction: PropTypes.func
}
