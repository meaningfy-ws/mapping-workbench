import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';

import {FileResourceCollectionsList} from './file-resource-collections-list';
import {useTranslation} from "react-i18next";
import {tokens} from "../../../locales/tokens";

export const FileResourceCollectionsCard = (props) => {
    const {collectionApi, filters = {}, ...other} = props;
    const {t} = useTranslation();
    const collectionTitle = t(tokens.nav[collectionApi.section]);
    const collectionPath = paths.app[collectionApi.section].index;

    const requestBase = {
        page: 0,
        rowsPerPage: -1
    }
    return (
        <Card>
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    spacing={2}
                    direction={{
                        xs: 'column',
                        sm: 'row',
                    }}
                >
                    <img
                        src="/assets/icons/icon-folder.svg"
                        width={48}
                        alt=""
                    />
                    <div>
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={collectionPath}
                            variant="h6"
                        >
                            {collectionTitle}
                        </Link>
                    </div>
                </Stack>
                <Box sx={{mt: 2}}>
                    <FileResourceCollectionsList collectionApi={collectionApi}
                                                 filters={filters}
                                                 request={requestBase}/>
                </Box>
            </CardContent>
        </Card>
    );
};

FileResourceCollectionsCard.propTypes = {};
