import {useRef} from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButtonGroup, {toggleButtonGroupClasses} from '@mui/material/ToggleButtonGroup';

export const ItemSearch = (props) => {
    const {
        onFiltersChange, onSortChange, onViewChange, view = 'grid'
    } = props;
    const queryRef = useRef(null);

    const handleQueryChange = (event) => {
        event.preventDefault();
        const query = queryRef.current?.value || '';

        onFiltersChange?.(query);
    }

    const handleViewChange = (event, value) => {
        onViewChange?.(value);
    }

    return (
        <Card>
            <Stack
                alignItems="center"
                direction="row"
                gap={2}
                sx={{p: 2}}
            >
                <Box
                    component="form"
                    onSubmit={handleQueryChange}
                    sx={{flexGrow: 1}}
                >
                    <OutlinedInput
                        defaultValue=""
                        fullWidth
                        inputProps={{ref: queryRef}}
                        name="itemName"
                        placeholder="Search"
                        startAdornment={(
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        )}
                    />
                </Box>
                <ToggleButtonGroup
                    exclusive
                    onChange={handleViewChange}
                    sx={{
                        borderWidth: 1,
                        borderColor: 'divider',
                        borderStyle: 'solid',
                        [`& .${toggleButtonGroupClasses.grouped}`]: {
                            margin: 0.5,
                            border: 0,
                            '&:not(:first-of-type)': {
                                borderRadius: 1
                            },
                            '&:first-of-type': {
                                borderRadius: 1
                            }
                        }
                    }}
                    value={view}
                >
                    <ToggleButton value="grid">
                        <GridViewIcon/>
                    </ToggleButton>
                    <ToggleButton value="list">
                        <FormatListBulletedIcon/>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
        </Card>
    );
};

ItemSearch.propTypes = {
    onFiltersChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onViewChange: PropTypes.func,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf(['asc', 'desc']),
    view: PropTypes.oneOf(['grid', 'list'])
};
