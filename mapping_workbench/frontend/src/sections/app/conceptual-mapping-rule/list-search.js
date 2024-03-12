import {useCallback, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {MultiSelect} from 'src/components/multi-select';
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";


const statusOptions = [
    {
        label: 'Published',
        value: 'published'
    },
    {
        label: 'Draft',
        value: 'draft'
    }
];

export const ListSearch = (props) => {
    const {onFiltersChange, onDetailedViewChange, detailedView, placeholder="Search", ...other} = props;
    const queryRef = useRef(null);
    const [chips, setChips] = useState([]);

    useEffect(() => {
        handleChipsUpdate();
    }, [chips]);


    const handleChipsUpdate = () => {
        const filters = {
            q: undefined,
            terms_validity: undefined,
            status: [],
        };

        chips.forEach((chip) => {
            switch (chip.field) {
                case 'q':
                    // There will (or should) be only one chips with field "q"
                    // so we can set up it directly
                    filters.q = chip.value;
                    break;
                case 'terms_validity':
                    filters.terms_validity = chip.value;
                    break;
                case 'status':
                    filters.status.push(chip.value);
                    break;
                default:
                    break;
            }
        });

        onFiltersChange?.(filters);
    }


    const handleChipDelete = deletedChip => {
        setChips((prevChips) => {
            return prevChips.filter((chip) => {
                // There can exist multiple chips for the same field.
                // Filter them by value.

                return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
            });
        });
    }

    const handleQueryChange = event => {
        event.preventDefault();

        const value = queryRef.current?.value ?? '';

        setChips(prevChips => {
            const found = prevChips?.find(chip => chip.field === 'q');

            if (found) {
                if (value)
                    return prevChips.map((chip) => chip.field === 'q' ? {...chip, value} : chip);
                else
                    return prevChips.filter((chip) => chip.field !== 'q');
            }
            else
                if (value) {
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
    }

    const handleTermsValidityChange = event => {
        const value = event.target.value || '';

        setChips((prevChips) => {
            const found = prevChips.find((chip) => chip.field === 'terms_validity');

            if (found && value) {
                return prevChips.map((chip) => {
                    if (chip.field === 'terms_validity') {
                        return {
                            ...chip,
                            value: value || ''
                        };
                    }

                    return chip;
                });
            }

            if (found && !value) {
                return prevChips.filter((chip) => chip.field !== 'terms_validity');
            }

            if (!found && value) {
                const chip = {
                    label: 'Terms',
                    field: 'terms_validity',
                    value
                };

                return [...prevChips, chip];
            }

            return prevChips;
        });
    }

    const handleStatusChange = values => {
        setChips((prevChips) => {
            const valuesFound = [];

            // First cleanup the previous chips
            const newChips = prevChips.filter((chip) => {
                if (chip.field !== 'status') {
                    return true;
                }

                const found = values.includes(chip.value);

                if (found) {
                    valuesFound.push(chip.value);
                }

                return found;
            });

            // Nothing changed
            if (values.length === valuesFound.length) {
                return newChips;
            }

            values.forEach((value) => {
                if (!valuesFound.includes(value)) {
                    const option = statusOptions.find((option) => option.value === value);

                    newChips.push({
                        label: 'Status',
                        field: 'status',
                        value,
                        displayValue: option.label
                    });
                }
            });

            return newChips;
        });
    }


    // We memoize this part to prevent re-render issues
    const statusValues = chips?.filter(chip => chip.field === 'status').map(chip => chip.value)

    const termsValidityValue = useMemo(() => (chips
        .find((chip) => chip.field === 'terms_validity') || {'value': ''}).value, [chips]);

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
                    placeholder={placeholder}
                    sx={{flexGrow: 1}}
                />
            </Stack>
            <Divider/>
            {chips?.length
                ?
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
                                            <b>{chip.label}</b>
                                            {` :${chip.displayValue ?? chip.value}`}:
                                        </>
                                    </Box>
                                )}
                                onDelete={() => handleChipDelete(chip)}
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                :
                    <Box sx={{p: 2.5}}>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            No filters applied
                        </Typography>
                    </Box>
                }

            <Box sx={{p: 2.5, display: 'flex'}}
                 direction="row">
                <FormControlLabel fullWidth
                                  control={
                                        <Switch
                                            checked={detailedView}
                                            value={detailedView}
                                            onChange={(e) => onDetailedViewChange(e, e.target.checked)}
                                        />
                                    }
                                  label="Detailed view"/>
                <Stack
                    component={RadioGroup}
                    defaultValue={termsValidityValue}
                    name="terms_validity"
                    spacing={3}
                    onChange={handleTermsValidityChange}
                >
                    <Paper
                        key="2"
                        sx={{
                            alignItems: 'flex-start',
                            display: 'flex',
                            p: 2
                        }}
                        variant="outlined"
                    >
                        <Box sx={{mr: 2, mt: 1}}>
                            <b>Terms:</b>
                        </Box>
                        <FormControlLabel
                            control={<Radio/>}
                            key="terms_validity_all"
                            checked={termsValidityValue === ''}
                            label={(
                                <Box sx={{ml: 0, mr: 1}}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        All
                                    </Typography>
                                </Box>
                            )}
                            value=""
                        />
                        <FormControlLabel
                            control={<Radio/>}
                            key="terms_validity_valid"
                            checked={termsValidityValue === 'valid'}
                            label={(
                                <Box sx={{ml: 0, mr: 1}}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        Valid
                                    </Typography>
                                </Box>
                            )}
                            value="valid"
                        />
                        <FormControlLabel
                            control={<Radio/>}
                            key="terms_validity_invalid"
                            checked={termsValidityValue === 'invalid'}
                            label={(
                                <Box sx={{ml: 0, mr: 1}}>
                                    <Typography
                                        variant="subtitle2"
                                    >
                                        Invalid
                                    </Typography>
                                </Box>
                            )}
                            value="invalid"
                        />
                    </Paper>
                </Stack>
            </Box>

            <Divider/>
            {showStatus && <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                spacing={1}
                sx={{p: 1}}
            >
                <MultiSelect
                    label="Status"
                    onChange={handleStatusChange}
                    options={statusOptions}
                    value={statusValues}
                />
            </Stack>}
        </div>
    );
};

ListSearch.propTypes = {
    onFiltersChange: PropTypes.func,
    onDetailedViewChange: PropTypes.func
};
