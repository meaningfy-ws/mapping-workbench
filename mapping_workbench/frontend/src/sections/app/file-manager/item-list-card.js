import PropTypes from 'prop-types';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import {usePopover} from 'src/hooks/use-popover';

import {ItemIcon} from './item-icon';
import {ItemMenu} from './item-menu';
import {paths} from "../../../paths";
import {useRouter} from "src/hooks/use-router";

export const ItemListCard = (props) => {
    const router = useRouter();
    const {item, collection, sectionApi, fileResourcesApi, onGetItems} = props;
    const popover = usePopover();

    const handleEdit = (item_id) => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.edit,
            query: {id: collection._id, fid: item_id}
        });
    }

    const handleDelete = async () => {
        fileResourcesApi.deleteFileResource(item._id)
            .then(() => onGetItems ? onGetItems() : router.reload())
    }
    return (
        <>
            <Card
                key={item._id}
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 0,
                    transition: (theme) => theme.transitions.create(['background-color, box-shadow'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: 200
                    }),
                    '&:hover': {
                        backgroundColor: 'background.paper',
                        boxShadow: 16
                    }
                }}
                variant="outlined"
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    sx={{
                        pt: 2,
                        px: 2
                    }}
                >
                    <Typography
                        onClick={() => handleEdit?.(item._id)}
                        sx={{cursor: 'pointer'}}
                        variant="subtitle2"
                    >
                        {item.title}
                    </Typography>
                    <IconButton
                        onClick={popover.handleOpen}
                        ref={popover.anchorRef}
                    >
                        <MoreVertIcon fontSize='small'/>
                    </IconButton>
                </Stack>
                <Box sx={{p: 2}}>
                    <Box
                        sx={{
                            display: 'flex',
                            mb: 1
                        }}
                    >
                        <Box
                            onClick={() => handleEdit?.(item._id)}
                            sx={{
                                display: 'inline-flex',
                                cursor: 'pointer'
                            }}
                        >
                            <ItemIcon
                                type="file"
                                extension="doc"
                            />
                        </Box>
                    </Box>

                    <Divider sx={{my: 1}}/>
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                        spacing={1}
                    >
                        <div>
                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                {item.identifier && `${item.identifier}.`}{item.format}
                            </Typography>
                        </div>
                    </Stack>
                    <Typography
                        color="text.secondary"
                        variant="caption"
                    >
                        Created at {item.created_at}
                    </Typography>
                </Box>
            </Card>
            <ItemMenu
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                onDelete={handleDelete}
                onEdit={() => handleEdit?.(item._id)}
                open={popover.open}
            />
        </>
    );
};

ItemListCard.propTypes = {
    item: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired
};
