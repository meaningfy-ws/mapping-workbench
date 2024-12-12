import {Pagination} from '@mui/material';


const TablePagination = (props) => {
    const {children, ...otherProps} = props
    return (
        <>
            <Pagination {...otherProps}/>
                {children}
            <Pagination {...otherProps}/>
        </>
    )
}

export default TablePagination

