import {useState} from "react";
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';

import {Scrollbar} from 'src/components/scrollbar';


const customerTypes = [{label: 'SuperUser', value: 'is_superuser'}, {label: 'User', value: 'user'}]

const ListTableRow = ({customer}) => {
    const [isAuthorized, setIsAuthorized] = useState(!!customer.is_authorized);
    const [customerType, setCustomerType] = useState(customer.type ?? 'user');


    return (
        <TableRow
            hover
            key={customer.id}
        >
            <TableCell>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <div>
                        <Typography>
                            {customer.name}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            {customer.email}
                        </Typography>
                    </div>
                </Stack>
            </TableCell>
            <TableCell padding="checkbox">
                <Checkbox
                    onChange={event => setIsAuthorized(event.target.checked)}
                    checked={isAuthorized}
                />
            </TableCell>
            <TableCell align='right'>
                <Select
                    sx={{width:'100px'}}
                    variant='standard'
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={customerType}
                    label="Age"
                    onChange={(e) => {
                        console.log(e)
                        setCustomerType(e.target.value)
                    }}
                >
                    {customerTypes.map(({value, label}) =>
                        <MenuItem key={label}
                                  value={value}>
                            {label}
                        </MenuItem>)}
                </Select>
            </TableCell>
        </TableRow>
    )
        ;
}


export const CustomerListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
    } = props;


    return (
        <Box sx={{position: 'relative'}}>
            <Scrollbar>
                <Table sx={{minWidth: 700}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Is Authorized</TableCell>
                            <TableCell align="right">Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((customer, i) => {
                            return (<ListTableRow customer={customer}
                                                  key={'row' + i}/>)
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
};

CustomerListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array,
};
