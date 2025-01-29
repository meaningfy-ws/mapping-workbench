import MuiTablePagination from '@mui/material/TablePagination'

const TablePagination = (props) => {
    const {children, showTop,...otherProps} = props
    return (
        <>
            {showTop && <MuiTablePagination {...otherProps}/>}
                {children}
            <MuiTablePagination {...otherProps}/>
        </>
    )
}

export default TablePagination

