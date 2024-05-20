import MuiTablePagination from '@mui/material/TablePagination'

const TablePagination = (props) => {
    const {children, ...otherProps} = props
    return (
        <>
            <MuiTablePagination {...otherProps}/>
                {children}
            <MuiTablePagination {...otherProps}/>
        </>
    )
}

export default TablePagination

