import {Button} from '@mui/material';

import {usePopover} from 'src/hooks/use-popover';
import {useCallback, useState} from "react";
import {paths} from 'src/paths';
import {useRouter} from "../../../hooks/use-router";
import {ACTION} from "../../../api/section";
import ConfirmDialog from "../dialog/confirm-dialog";
import {Box} from "@mui/system";

export const ListItemActions = (props) => {
    const router = useRouter();

    const {itemctx, pathnames} = props;
    const popover = usePopover();

    //console.log("itemctx: ", itemctx);    

    const handleViewAction = useCallback(async () => {
        const viewPathname = pathnames?.view ?? paths.app[itemctx.api.section].view;
        router.push({
            pathname: viewPathname,
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
        const deleteAction = itemctx.actions?.delete ?? itemctx.api.deleteItem
        const response = await deleteAction(itemctx.id);
        console.log("delete pathname: ", itemctx.api.section);

        router.push({
            pathname: paths.app[itemctx.api.section].index
        });
        window.location.reload();
    }, [router, itemctx]);

    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <Box>
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.VIEW) && <Button
                id="view_delete"
                variant="text"
                size="small"
                color="info"
                onClick={handleViewAction}
                sx={{
                    whiteSpace: "nowrap"
                }}
            >
                View
            </Button>}
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.EDIT) && <Button
                id="edit_button"
                variant="text"
                size="small"
                color="success"
                onClick={handleEditAction}
                sx={{
                    whiteSpace: "nowrap"
                }}
            >
                Edit
            </Button>}
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.DELETE) && <>
                <Button
                    id="edit_delete"
                    variant="text"
                    size="small"
                    color="error"
                    onClick={() => setConfirmOpen(true)}
                    sx={{
                        whiteSpace: "nowrap"
                    }}
                >
                    Delete
                </Button>
                <ConfirmDialog
                    title="Delete It?"
                    open={confirmOpen}
                    setOpen={setConfirmOpen}
                    onConfirm={handleDeleteAction}
                >
                    Are you sure you want to delete it?
                </ConfirmDialog>
            </>}

            {/* <Tooltip title="More options">
                <IconButton
                    onClick={popover.handleOpen}
                    ref={popover.anchorRef}
                    {...props}>
                    <SvgIcon>
                        <DotsHorizontalIcon/>
                    </SvgIcon>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={popover.anchorRef.current}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom'
                }}
                onClose={popover.handleClose}
                open={popover.open}
                PaperProps={{
                    sx: {
                        maxWidth: '100%',
                        width: 200
                    }
                }}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
            >
                <MenuItem onClick={handleViewAction}>
                    <ListItemIcon>
                        <SvgIcon>
                            <Eye/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="View"/>
                </MenuItem>
                <MenuItem onClick={handleEditAction}>
                    <ListItemIcon>
                        <SvgIcon>
                            <EditIcon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="Edit"/>
                </MenuItem>
                <MenuItem onClick={handleDeleteAction}>
                    <ListItemIcon>
                        <SvgIcon>
                            <DeleteIcon/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="Delete"/>
                </MenuItem>
            </Menu> */}
        </Box>
    );
};
