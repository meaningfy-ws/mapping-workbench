import {useState} from "react";
import {useRouter} from "next/router";
import PropTypes from 'prop-types';

import {Button} from '@mui/material';
import {Box} from "@mui/system";

import {paths} from 'src/paths';
import {usePopover} from 'src/hooks/use-popover';
import {ACTION} from "../../../api/section";
import ConfirmDialog from "../dialog/confirm-dialog";

export const ListItemActions = (props) => {
    const router = useRouter();

    const {itemctx, pathnames, onDeleteAction, confirmDialogContent} = props;
    const popover = usePopover();

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
        router.push({
            pathname: paths.app[itemctx.api.section].edit,
            query: {id: itemctx.id}
        });

    }

    const handleDeleteAction = async () => {
        itemctx.api.deleteItem(itemctx.id)
            .finally(() =>
                {
                    router.push({
                        pathname: paths.app[itemctx.api.section].index
                    });
                    router.reload()
                }
        )
    }

    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <Box>
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.VIEW) && <Button
                id="view_button"
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
                    id="delete_button"
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
                    onConfirm={onDeleteAction ?? handleDeleteAction}
                >
                    <>"Are you sure you want to delete it?"</>
                    <>{confirmDialogContent}</>
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


ListItemActions.propTypes = {
    itemctx: PropTypes.object,
    pathnames: PropTypes.object,
    onDeleteAction: PropTypes.func
}
