import Typography from '@mui/material/Typography';
import {useState} from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import Stack from '@mui/material/Stack';
import {Pagination} from '@mui/material';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const TablePagination = ({
                             children,
                             onRowsPerPageChange,
                             rowsPerPage,
                             rowsPerPageOptions,
                             onPageChange,
                             count,
                             page,
                             ...otherProps
                         }) => {

    const [rppAnchor, setRppAnchor] = useState(null)
    const handleChange = (event) => {
        onRowsPerPageChange(event)
        setRppAnchor(null)
    }

    const startPagedItems = rowsPerPage * page + 1
    const endPagedItems = rowsPerPage * (page + 1)

    return (
        <>
            {/*<Pagination color='primary'*/}
            {/*            {...otherProps}/>*/}
            {children}
            <Stack direction='row'
                   alignItems='center'
                   justifyContent='end'>
                {!!count &&
                    <Typography sx={{
                        fontSize: 14,
                        mb: .1
                    }}>{`${startPagedItems}-${endPagedItems > count ? count : endPagedItems}`}</Typography>}
                <Tooltip title='rows per page'>
                    <Button endIcon={<KeyboardArrowDownIcon/>}
                            onClick={e => setRppAnchor(e.target)}>
                        {rowsPerPage > 0 ? rowsPerPage : count}
                    </Button>
                </Tooltip>
                <Popover
                    id={'rppPopover'}
                    open={!!rppAnchor}
                    anchorEl={rppAnchor}
                    onClose={() => setRppAnchor(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    {rowsPerPageOptions.map(option => <MenuItem
                        key={option.value ?? option}
                        value={option.value ?? option}
                        selected={(option.value ?? option) === rowsPerPage}
                        onClick={handleChange}>
                        {option.label ?? option}
                    </MenuItem>)}
                </Popover>
                <Pagination color='primary'
                            page={page + 1}
                            onChange={(e, page) => onPageChange(e, page - 1)}
                            count={Math.ceil(count / (rowsPerPage > 0 ? rowsPerPage : count))}
                            {...otherProps}/>
            </Stack>
        </>
    )
}

export default TablePagination

