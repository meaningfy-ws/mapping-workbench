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

import {Scrollbar} from 'src/components/scrollbar';
import TableSorterHeader from "src/sections/components/table-sorter-header";
import TablePagination from "../../components/table-pagination";
import {useAuth} from "../../../hooks/use-auth";
import {securityApi} from "../../../api/security";


export const CustomerListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sort,
        onSort,
        onAuthorizeChange = () => {
        },
        onTypeChange = () => {
        },
        roles
    } = props;

    const auth = useAuth();

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }

    return (
        <Box sx={{position: 'relative'}}>
            <TablePagination component="div"
                             count={count}
                             onPageChange={onPageChange}
                             onRowsPerPageChange={onRowsPerPageChange}
                             page={page}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageOptions={[5, 10, 25, 50, {value: -1, label: 'All'}]}
                             showFirstButton
                             showLastButton>
                <Scrollbar>
                    <Table sx={{minWidth: 700}}>
                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    <SorterHeader title='Name'
                                                  fieldName='email'/>
                                </TableCell>
                                <TableCell>Is_Authorized</TableCell>
                                <TableCell align="right">Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map(user => <TableRow key={user._id}
                                                             hover>
                                <TableCell>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={1}
                                    >
                                        <div>
                                            <Typography>
                                                {user.name}
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body2"
                                            >
                                                {user.email}
                                            </Typography>
                                        </div>
                                    </Stack>
                                </TableCell>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        onChange={event => onAuthorizeChange(user._id, event.target.checked)}
                                        checked={!!user.is_verified && !!user.is_active}
                                        disabled={securityApi.isAuthUser(auth.user, user._id)}
                                    />
                                </TableCell>
                                <TableCell align='right'>
                                    <Select
                                        sx={{width: '100px'}}
                                        variant='standard'
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={user.roles[0] ?? 'user'}
                                        label="Age"
                                        onChange={(e) => {
                                            onTypeChange(user._id, e.target.value)
                                        }}
                                        disabled={securityApi.isAuthUser(auth.user, user._id)}
                                    >
                                        {roles.map((role) =>
                                            <MenuItem key={role}
                                                      value={role}>
                                                {role}
                                            </MenuItem>)}
                                    </Select>
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
        </Box>
    );
};

CustomerListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
};
