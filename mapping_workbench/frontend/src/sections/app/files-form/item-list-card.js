import PropTypes from 'prop-types';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {usePopover} from 'src/hooks/use-popover';

import {ItemIcon} from '../file-manager/item-icon';
import {ItemMenu} from '../file-manager/item-menu';
import {useRouter} from "src/hooks/use-router";

export const ItemListCard = (props) => {
    const router = useRouter();
    const {item, collection, sectionApi, fileResourcesApi, onGetItems, onViewDetails} = props;
    const popover = usePopover();

    const handleViewDetails = (item) => {
        onViewDetails(item.filename)
    }

    const handleDelete = () => {
        fileResourcesApi.deleteFileResource(item.filename)
            .then(() => onGetItems ? onGetItems() : router.reload())
    }
    return (
        <>
            <Card
                key={item.filename}
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
                        onClick={() => handleViewDetails?.(item)}
                        sx={{cursor: 'pointer'}}
                        variant="subtitle2"
                    >
                        {item.filename}
                    </Typography>
                    <IconButton
                        onClick={popover.handleOpen}
                        ref={popover.anchorRef}
                    >
                        <SvgIcon fontSize="small">
                            <DotsVerticalIcon/>
                        </SvgIcon>
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
                            onClick={() => handleViewDetails?.(item)}
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
                    {item.created_at && <Typography
                        color="text.secondary"
                        variant="caption"
                    >
                        Created at {item.created_at}
                    </Typography>}
                </Box>
            </Card>
            <ItemMenu
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                onDelete={handleDelete}
                open={popover.open}
            />
        </>
    );
};

ItemListCard.propTypes = {
    item: PropTypes.object.isRequired,
    collection: PropTypes.string.isRequired
};
