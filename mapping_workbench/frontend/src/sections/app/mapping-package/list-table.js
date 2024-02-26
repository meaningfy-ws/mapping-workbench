import {Fragment, useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import {useFormik} from "formik";
import * as Yup from "yup";
import {sessionApi} from "../../../api/session";
import toast from "react-hot-toast";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Box} from "@mui/system";

import { saveAs } from 'file-saver';



const PackageRow = (props) => {
    const {
        item, sectionApi
    } = props;

    const [isProcessing, setIsProcessing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const formik = useFormik({
        initialValues: {
            use_latest_package_state: false,
            transform_test_data: true,
            generate_cm_assertions: true,
            validate_package: true,
            validate_package_xpath: true,
            validate_package_sparql: true,
            validate_package_shacl: true
        },
        validationSchema: Yup.object({}),
        onSubmit: async (values, helpers) => {
            setIsProcessing(true)

            let tasks_to_run = [];
            if (values['transform_test_data']) {
                tasks_to_run.push('transform_test_data');
            }
            if (values['generate_cm_assertions']) {
                tasks_to_run.push('generate_cm_assertions');
            }
            if (values['validate_package']) {
                tasks_to_run.push('validate_package');
            }
            if (values['validate_package_xpath']) {
                tasks_to_run.push('validate_package_xpath');
            }
            if (values['validate_package_sparql']) {
                tasks_to_run.push('validate_package_sparql');
            }
            if (values['validate_package_shacl']) {
                tasks_to_run.push('validate_package_shacl');
            }
            let data = {
                package_id: item._id,
                project_id: sessionApi.getSessionProject(),
                use_latest_package_state: values['use_latest_package_state']
            }
            if (tasks_to_run.length > 0) {
                data.tasks_to_run = tasks_to_run.join(',');
            }
            toast.promise(sectionApi.processPackage(data), {
                loading: `Processing "${item.identifier}" ... This may take a while. Please, be patient.`,
                success: (response) => {
                    setIsProcessing(false);
                    return `"${response.result.title}" successfully processed in ${(response.task.duration / 60).toFixed(2)} minutes.`
                },
                error: (err) => {
                    setIsProcessing(false);
                    return `Processing "${item.identifier}" failed: ${err.message}.`
                }
            }).then(r => {
            })
        }
    });

    const handleExport = useCallback((itemId) => {
        setIsExporting(true)
        let data = {
            package_id: item._id,
            project_id: sessionApi.getSessionProject()
        }
        toast.promise(sectionApi.exportPackage(data), {
            loading: `Exporting "${item.identifier}" ... This may take a while. Please, be patient.`,
            success: (response) => {
                setIsExporting(false);
                saveAs(new Blob([response], {type: "application/x-zip-compressed"}), `${item.identifier}.zip`);
                return `"${item.identifier}" successfully exported.`
            },
            error: (err) => {
                setIsExporting(false);
                return `Exporting "${item.identifier}" failed: ${err.message}.`
            }
        }).then(r => {
        })
    }, []);

    return (<>
            <CardContent>
                <Grid container>
                    <Grid
                        item
                        md={12}
                        xs={12}
                    >
                        <PropertyList>
                            <PropertyListItem
                                label="Description"
                                value={item.description}
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    px: 3,
                                    py: 1.5
                                }}
                            />
                        </PropertyList>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider/>
            <Card
                sx={{
                    px: 3
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Stack
                        direction={{
                            xs: 'column',
                            sm: 'row'
                        }}
                        flexWrap="wrap"
                        spacing={3}
                        sx={{p: 3}}
                    >
                        <Button
                            id='process_button'
                            disabled={isProcessing || isExporting}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {!isProcessing && "Process"}
                            {isProcessing && "Processing ..."}
                        </Button>
                        <Box>
                            <FormControlLabel
                                sx={{
                                    width: '100%',
                                }}
                                control={
                                    <Switch
                                        disabled={true}
                                        checked={formik.values.use_latest_package_state}
                                        onChange={(event) => formik.setFieldValue('use_latest_package_state', event.target.checked)}
                                    />
                                }
                                label="Use latest Package State"
                            />
                            <Divider sx={{my:2}}/>
                            <b>Processing a Mapping Package includes:</b>
                            <ul style={{listStyleType: "none", padding: 0}}>
                                <li>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                checked={formik.values.transform_test_data}
                                                onChange={(event) => formik.setFieldValue('transform_test_data', event.target.checked)}
                                            />
                                        }
                                        label="Transform Test Data"
                                    />
                                </li>
                                <li>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                checked={formik.values.generate_cm_assertions}
                                                onChange={(event) => formik.setFieldValue('generate_cm_assertions', event.target.checked)}
                                            />
                                        }
                                        label="Generate CM Assertions Queries"
                                    />
                                </li>
                                <li>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                checked={formik.values.validate_package}
                                                onChange={(event) => formik.setFieldValue('validate_package', event.target.checked)}
                                            />
                                        }
                                        label="Validate the Mapping Package"
                                    />
                                    <ul style={{listStyleType: "none"}}>
                                        <li>
                                            <FormControlLabel
                                                sx={{
                                                    width: '100%'
                                                }}
                                                control={
                                                    <Switch
                                                        checked={formik.values.validate_package_shacl}
                                                        onChange={(event) => formik.setFieldValue('validate_package_shacl', event.target.checked)}
                                                    />
                                                }
                                                label="SHACL"
                                            />
                                        </li>
                                        <li>
                                            <FormControlLabel
                                                sx={{
                                                    width: '100%'
                                                }}
                                                control={
                                                    <Switch
                                                        checked={formik.values.validate_package_xpath}
                                                        onChange={(event) => formik.setFieldValue('validate_package_xpath', event.target.checked)}
                                                    />
                                                }
                                                label="XPATH"
                                            />
                                        </li>
                                        <li>
                                            <FormControlLabel
                                                sx={{
                                                    width: '100%'
                                                }}
                                                control={
                                                    <Switch
                                                        checked={formik.values.validate_package_sparql}
                                                        onChange={(event) => formik.setFieldValue('validate_package_sparql', event.target.checked)}
                                                    />
                                                }
                                                label="SPARQL"
                                            />
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </Box>
                        <Button
                            id='export_latest_button'
                            disabled={isProcessing || isExporting}
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleExport()}
                        >
                            {!isExporting && "Export Latest"}
                            {isExporting && "Exporting Latest ..."}
                        </Button>
                    </Stack>
                </form>
            </Card>
        </>
    )
}

export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    //console.log("PROJECT PROPS: ", props);

    const [currentItem, setCurrentItem] = useState(null);

    const handleItemToggle = useCallback((itemId) => {
        setCurrentItem((prevItemId) => {
            if (prevItemId === itemId) {
                return null;
            }

            return itemId;
        });
    }, []);

    // const handleItemClose = useCallback(() => {
    //     setCurrentItem(null);
    // }, []);

    // const handleItemUpdate = useCallback(() => {
    //     setCurrentItem(null);
    //     toast.success('Item updated');
    // }, []);

    // const handleItemDelete = useCallback(() => {

    //     toast.error('Item cannot be deleted');
    // }, []);

    return (
        <div>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell width="25%">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Title
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Identifier
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        active
                                        direction="desc"
                                    >
                                        Created
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {
                            const item_id = item._id;
                            const isCurrent = item_id === currentItem;
                            const statusColor = item.status === 'published' ? 'success' : 'info';

                            return (
                                <Fragment key={item_id}>
                                    <TableRow
                                        hover
                                        key={item_id}
                                        id={item_id}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            sx={{
                                                ...(isCurrent && {
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                })
                                            }}
                                            width="25%"
                                        >
                                            <IconButton onClick={() => handleItemToggle(item_id)}
                                                        id="expand_button">
                                                <SvgIcon>
                                                    {isCurrent ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>

                                        <TableCell width="25%">
                                            <Typography variant="subtitle2">
                                                {item.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.identifier}
                                        </TableCell>
                                        <TableCell align="left">
                                            {(item.created_at).replace("T", " ").split(".")[0]}
                                        </TableCell>
                                        <TableCell align="right">
                                            <ListItemActions
                                                itemctx={new ForListItemAction(item_id, sectionApi)}/>
                                        </TableCell>
                                    </TableRow>
                                    {isCurrent && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                sx={{
                                                    p: 0,
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                }}
                                            >
                                                <PackageRow
                                                    item={item}
                                                    sectionApi={sectionApi}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            );
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
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
        </div>
    );
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
