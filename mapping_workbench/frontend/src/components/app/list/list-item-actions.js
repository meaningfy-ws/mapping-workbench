import {Button} from '@mui/material';
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
import {Box} from "@mui/system";
import {ACTION} from "../../../api/section";

export const ListItemActions = (props) => {
    const router = useRouter();

    const {itemctx} = props;
    const popover = usePopover();

    //console.log("itemctx: ", itemctx);    

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
        console.log("delete pathname: ", itemctx.api.section);

        router.push({
            pathname: paths.app[itemctx.api.section].index
        });
        window.location.reload();
    }, [router, itemctx]);

    return (
        <>
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.VIEW) && <Button
                variant="text"
                size="small"
                color="info"
                onClick={handleViewAction}
            >
                View
            </Button>}
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.EDIT) && <Button
                variant="text"
                size="small"
                color="success"
                onClick={handleEditAction}
            >
                Edit
            </Button>}
            {itemctx.api.SECTION_LIST_ACTIONS.includes(ACTION.DELETE) && <Button
                variant="text"
                size="small"
                color="error"
                onClick={handleDeleteAction}
            >
                Delete
            </Button>}

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
        </>
    );
};
