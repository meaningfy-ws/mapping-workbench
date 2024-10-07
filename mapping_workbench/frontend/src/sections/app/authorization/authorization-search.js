import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useUpdateEffect } from 'src/hooks/use-update-effect';


export const CustomerListSearch = (props) => {
  const { onSearchChange } = props;
  const queryRef = useRef(null);
  const [filters, setFilters] = useState({});

  const handleFiltersUpdate = useCallback(() => {
    console.log(onSearchChange,filters)
    onSearchChange?.(filters.query);
  }, [filters, onSearchChange]);

  useUpdateEffect(() => {
    handleFiltersUpdate();
  }, [filters, handleFiltersUpdate]);

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value,
    }));
  }, []);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{ p: 3 }}
      >
        <Box
          component="form"
          onSubmit={handleQueryChange}
          sx={{ flexGrow: 1 }}
        >
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            placeholder="Search customers"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
      </Stack>
    </>
  );
};

CustomerListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
};
