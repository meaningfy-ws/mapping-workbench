import {useCallback, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {useUpdateEffect} from 'src/hooks/use-update-effect';


export const ListSearch = (props) => {
    const {onFiltersChange, ...other} = props;
    const queryRef = useRef(null);
    const [chips, setChips] = useState([]);

    const handleChipsUpdate = useCallback(() => {
        const filters = {
            q: undefined,
            status: [],
        };

        chips.forEach((chip) => {
            switch (chip.field) {
                case 'q':
                    // There will (or should) be only one chips with field "q"
                    // so we can set up it directly
                    filters.q = chip.value;
                    break;
                case 'status':
                    filters.status.push(chip.value);
                    break;
                default:
                    break;
            }
        });

        onFiltersChange?.(filters);
    }, [chips, onFiltersChange]);

    useUpdateEffect(() => {
        handleChipsUpdate();
    }, [chips, handleChipsUpdate]);

    const handleChipDelete = useCallback((deletedChip) => {
        setChips((prevChips) => {
            return prevChips.filter((chip) => {
                // There can exist multiple chips for the same field.
                // Filter them by value.

                return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
            });
        });
    }, []);

    const handleQueryChange = useCallback((event) => {
        event.preventDefault();

        const value = queryRef.current?.value || '';

        setChips((prevChips) => {
            const found = prevChips.find((chip) => chip.field === 'q');

            if (found && value) {
                return prevChips.map((chip) => {
                    if (chip.field === 'q') {
                        return {
                            ...chip,
                            value: queryRef.current?.value || ''
                        };
                    }

                    return chip;
                });
            }

            if (found && !value) {
                return prevChips.filter((chip) => chip.field !== 'q');
            }

            if (!found && value) {
                const chip = {
                    label: 'Q',
                    field: 'q',
                    value
                };

                return [...prevChips, chip];
            }

            return prevChips;
        });

        if (queryRef.current) {
            queryRef.current.value = '';
        }
    }, []);


    const showChips = chips.length > 0;

    return (
        <div {...other}>
            <Stack
                alignItems="center"
                component="form"
                direction="row"
                onSubmit={handleQueryChange}
                spacing={2}
                sx={{p: 2}}
            >
                <SvgIcon>
                    <SearchMdIcon/>
                </SvgIcon>
                <Input
                    defaultValue=""
                    disableUnderline
                    fullWidth
                    inputProps={{ref: queryRef}}
                    placeholder="Search"
                    sx={{flexGrow: 1}}
                />
            </Stack>
            <Divider/>
            {showChips
                ? (
                    <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{p: 2}}
                    >
                        {chips.map((chip, index) => (
                            <Chip
                                key={index}
                                label={(
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            '& span': {
                                                fontWeight: 600
                                            }
                                        }}
                                    >
                                        <>
                        <span>
                          {chip.label}
                        </span>
                                            :
                                            {' '}
                                            {chip.displayValue || chip.value}
                                        </>
                                    </Box>
                                )}
                                onDelete={() => handleChipDelete(chip)}
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                )
                : (
                    <Box sx={{p: 2.5}}>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            No filters applied
                        </Typography>
                    </Box>
                )}
            <Divider/>
        </div>
    );
};

ListSearch.propTypes = {
    onFiltersChange: PropTypes.func
};
