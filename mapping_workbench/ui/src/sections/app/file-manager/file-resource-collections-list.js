import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useMounted} from "../../../hooks/use-mounted";
import {useCallback, useEffect, useState} from "react";
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const useItemsStore = (collectionApi, filters) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        collections: [],
        collectionsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const collectionResponse = await collectionApi.getItems({
                filters: filters
            });

            if (isMounted()) {
                setState({
                    collections: collectionResponse.items,
                    collectionsCount: collectionResponse.count
                });

            }

        } catch (err) {
            console.error(err);
        }
    }, [collectionApi, filters, isMounted]);

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [collectionApi]);

    return {
        ...state
    };
};

export const FileResourceCollectionsList = (props) => {
    const router = useRouter();
    const {collectionApi, filters = {}, ...other} = props;
    const itemsStore = useItemsStore(collectionApi, filters);

    return (
        <Stack divider={<Divider/>}>
            {itemsStore.collections.map((collection) => {
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
                            <Typography
                                color="text.secondary"
                                variant="caption"
                            >
                                {}
                            </Typography>
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
                                color="info"
                            >Resources</Button>
                            <Button
                                size="small"
                                onClick={() => {
                                    router.push({
                                        pathname: paths.app[collectionApi.section].edit,
                                        query: {id: collection._id}
                                    });
                                }}
                                color="success"
                            >Edit</Button>
                        </Stack>
                    </Stack>
                );
            })}
        </Stack>
    );
};

FileResourceCollectionsList.propTypes = {};
