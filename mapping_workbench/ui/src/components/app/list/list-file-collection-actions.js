import EditIcon from '@untitled-ui/icons-react/build/esm/Edit02';
import Eye from '@untitled-ui/icons-react/build/esm/Eye';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import DeleteIcon from '@untitled-ui/icons-react/build/esm/Delete';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';


import {usePopover} from 'src/hooks/use-popover';
import {useCallback} from "react";
import {paths} from 'src/paths';
import {useRouter} from "../../../hooks/use-router";
import {FileAttachment04} from "@untitled-ui/icons-react";

export const ListFileCollectionActions = (props) => {
    const router = useRouter();

    const {itemctx} = props;
    const popover = usePopover();

    const handleFileManagerAction = useCallback(async () => {
        router.push({
            pathname: paths.app[itemctx.api.section].file_manager.index,
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
        console.log([router, itemctx]);
        const response = await itemctx.api.deleteItem(itemctx.id);
        router.push({
            pathname: paths.app[itemctx.api.section].index
        });
        window.location.reload();
    }, [router, itemctx]);

    return (
        <>
            <Tooltip title="More options">
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
                <MenuItem onClick={handleFileManagerAction}>
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
            </Menu>
        </>
    );
};
