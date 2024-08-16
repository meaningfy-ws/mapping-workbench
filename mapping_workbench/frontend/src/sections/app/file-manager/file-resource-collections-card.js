import PropTypes from 'prop-types';
import CheckVerified01 from '@untitled-ui/icons-react/build/esm/CheckVerified01';
import Star01Icon from '@untitled-ui/icons-react/build/esm/Star01';
import Users01Icon from '@untitled-ui/icons-react/build/esm/Users01';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import {getInitials} from 'src/utils/get-initials';

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
                        <Typography variant="body2">{}</Typography>
                    </div>
                </Stack>
                <Box sx={{mt: 2}}>
                    <FileResourceCollectionsList collectionApi={collectionApi} filters={filters} request={requestBase}/>
                </Box>
            </CardContent>
        </Card>
    );
};

FileResourceCollectionsCard.propTypes = {};
