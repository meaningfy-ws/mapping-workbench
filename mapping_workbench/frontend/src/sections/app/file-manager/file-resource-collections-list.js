import {useEffect, useState} from "react";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {paths} from "../../../paths";
import {useRouter} from "next/router";

const useItemsStore = (collectionApi, filters, request = {}) => {
    const [state, setState] = useState({
        collections: [],
        collectionsCount: 0
    });

    request.filters = filters

    const handleItemsGet = () => {
        collectionApi.getItems(request)
            .then(res => setState({
                    collections: res.items,
                    collectionsCount: res.count
                })
            )
            .catch(err => console.error(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        ...state
    };
};

export const FileResourceCollectionsList = (props) => {
    const router = useRouter();
    const {collectionApi, filters = {}, request = {}, ...other} = props;
    const itemsStore = useItemsStore(collectionApi, filters, request);

    return (
        <Stack divider={<Divider/>}>
            {itemsStore.collections.map(collection => {
                return (
                    <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        justifyContent="space-between"
                        key={collection._id}
                        sx={{
                            px: 2,
                            py: 1.5,
                        }}
                    >
                        <div>
                            <Typography variant="subtitle1">{collection.title}</Typography>
                        </div>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <Button
                                size="small"
                                onClick={() => {
                                    router.push({
                                        pathname: paths.app[collectionApi.section].resource_manager.index,
                                        query: {id: collection._id}
                                    });
                                }}
                                color="info">
                                Assets
                            </Button>
                            <Button
                                size="small"
                                onClick={() => {
                                    router.push({
                                        pathname: paths.app[collectionApi.section].edit,
                                        query: {id: collection._id}
                                    });
                                }}
                                color="success">
                                Edit
                            </Button>
                        </Stack>
                    </Stack>
                );
            })}
        </Stack>
    );
};

FileResourceCollectionsList.propTypes = {};
