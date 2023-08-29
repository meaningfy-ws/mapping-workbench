import {useCallback} from 'react';
import PropTypes from 'prop-types';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {usePopover} from 'src/hooks/use-popover';

import {ItemIcon} from './item-icon';
import {ItemMenu} from './item-menu';
import {paths} from "../../../paths";
import {useRouter} from "src/hooks/use-router";

export const ItemListRow = (props) => {
    const router = useRouter();

    const {item, collection, sectionApi, fileResourcesApi} = props;
    const popover = usePopover();

    const handleEdit = useCallback(async () => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.edit,
            query: {id: collection._id, fid: item._id}
        });

    }, [router, item, collection, sectionApi]);

    const handleDelete = useCallback(async () => {
        const response = await fileResourcesApi.deleteFileResource(item._id);
        router.reload();
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.index,
            query: {
                id: collection._id,
                refreshed: Date.now()
            }
        });

    }, [router, item, collection, sectionApi]);

    return (
        <>
            <TableRow
                key={item.id}
                sx={{
                    backgroundColor: 'transparent',
                    borderRadius: 1.5,
                    boxShadow: 0,
                    transition: (theme) => theme.transitions.create(['background-color', 'box-shadow'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: 200
                    }),
                    '&:hover': {
                        backgroundColor: 'background.paper',
                        boxShadow: 16
                    },
                    [`& .${tableCellClasses.root}`]: {
                        borderBottomWidth: 1,
                        borderBottomColor: 'divider',
                        borderBottomStyle: 'solid',
                        borderTopWidth: 1,
                        borderTopColor: 'divider',
                        borderTopStyle: 'solid',
                        '&:first-of-type': {
                            borderTopLeftRadius: (theme) => theme.shape.borderRadius * 1.5,
                            borderBottomLeftRadius: (theme) => theme.shape.borderRadius * 1.5,
                            borderLeftWidth: 1,
                            borderLeftColor: 'divider',
                            borderLeftStyle: 'solid'
                        },
                        '&:last-of-type': {
                            borderTopRightRadius: (theme) => theme.shape.borderRadius * 1.5,
                            borderBottomRightRadius: (theme) => theme.shape.borderRadius * 1.5,
                            borderRightWidth: 1,
                            borderRightColor: 'divider',
                            borderRightStyle: 'solid'
                        }
                    }
                }}
            >
                <TableCell>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <Box
                            onClick={() => handleEdit?.(item.id)}
                            sx={{cursor: 'pointer'}}
                        >
                            <ItemIcon
                                type="file"
                                extension="doc"
                            />
                        </Box>
                        <div>
                            <Typography
                                noWrap
                                onClick={() => handleEdit?.(item.id)}
                                sx={{cursor: 'pointer'}}
                                variant="subtitle2"
                            >
                                {item.title}
                            </Typography>
                            <Typography
                                color="text.secondary"
                                noWrap
                                variant="body2"
                            >
                                {item.format}
                            </Typography>
                        </div>
                    </Stack>
                </TableCell>
                <TableCell>
                    <Typography
                        noWrap
                        variant="subtitle2"
                    >
                        Created at {item.created_at}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        noWrap
                        variant="body2"
                    >
                        {item._at}
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <IconButton
                        onClick={popover.handleOpen}
                        ref={popover.anchorRef}
                    >
                        <SvgIcon fontSize="small">
                            <DotsVerticalIcon/>
                        </SvgIcon>
                    </IconButton>
                </TableCell>
            </TableRow>
            <ItemMenu
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                onEdit={handleEdit}
                onDelete={handleDelete}
                open={popover.open}
            />
        </>
    );
};

ItemListRow.propTypes = {
    item: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired
};
