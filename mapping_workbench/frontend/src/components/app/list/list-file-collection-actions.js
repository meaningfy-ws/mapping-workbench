import {Button} from '@mui/material';

import {usePopover} from 'src/hooks/use-popover';
import {useCallback, useState} from "react";
import {paths} from 'src/paths';
import {useRouter} from "next/router";
import {MenuActionButton} from '../../menu-actions';
import ConfirmDialog from "../dialog/confirm-dialog";

export const ListFileCollectionActions = (props) => {
    const router = useRouter();

    const {itemctx} = props;

    const handleResourceManagerAction = useCallback(async () => {
        router.push({
            pathname: paths.app[itemctx.api.section].resource_manager.index,
            query: {id: itemctx.id}
        });

    }, [router, itemctx]);

    const handleViewAction = useCallback(async () => {
        router.push({
            pathname: paths.app[itemctx.api.section].view,
            query: {id: itemctx.id}
        });
    }, [router, itemctx]);

    const handleEditAction = useCallback(async () => {
        router.push({
            pathname: paths.app[itemctx.api.section].edit,
            query: {id: itemctx.id}
        });

    }, [router, itemctx]);

    const handleDeleteAction = useCallback(async () => {
        const response = await itemctx.api.deleteItem(itemctx.id);
        router.push({
            pathname: paths.app[itemctx.api.section].index
        });
        window.location.reload();
    }, [router, itemctx]);

    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <MenuActionButton
                id="resources_button"
                action={handleResourceManagerAction}
                text='Resources'
            />
            <MenuActionButton
                id="edit_button"
                action={handleEditAction}
                text='Edit'
            />
            <MenuActionButton
                id="delete_button"
                action={() => setConfirmOpen(true)}
                text='Delete'
            />
            <ConfirmDialog
                title="Delete It?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={handleDeleteAction}
                last
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
        </>
    );
};
