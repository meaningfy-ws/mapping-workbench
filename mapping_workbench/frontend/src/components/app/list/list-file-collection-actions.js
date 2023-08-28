import {Button} from '@mui/material';


import {usePopover} from 'src/hooks/use-popover';
import {useCallback} from "react";
import {paths} from 'src/paths';
import {useRouter} from "../../../hooks/use-router";

export const ListFileCollectionActions = (props) => {
    const router = useRouter();

    const {itemctx} = props;
    const popover = usePopover();

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

    return (
        <>
            <div className='newActionButtons' sx={{ display: "flex", flexDirection: "inline", justifyContent: "space-evenly"}}>
                {/*<Button
                    variant="text"
                    size="small"
                    color="secondary"
                    onClick={handleViewAction}
                >
                View
                </Button>*/}
                <Button
                    variant="text"
                    size="small"
                    color="info"
                    onClick={handleResourceManagerAction}
                >
                Resources
                </Button>
                <Button
                    variant="text"
                    size="small"
                    color="success"
                    onClick={handleEditAction}
                >
                Edit
                </Button>
                <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={handleDeleteAction}
                >
                Delete
                </Button>
            </div>
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
                <MenuItem onClick={handleResourceManagerAction}>
                    <ListItemIcon>
                        <SvgIcon>
                            <FileAttachment04/>
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary="File Manager"/>
                </MenuItem>
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
        </>
    );
};
