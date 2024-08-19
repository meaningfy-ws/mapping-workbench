import {Fragment, useState} from 'react';
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
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/system/Box";

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {useFormik} from "formik";
import * as Yup from "yup";
import {sessionApi} from "../../../api/session";
import {saveAs} from 'file-saver';
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import TablePagination from "../../components/table-pagination";
import TableSorterHeader from "../../components/table-sorter-header";
import timeTransformer from "../../../utils/time-transformer";
import {useGlobalState} from "../../../hooks/use-global-state";
import SorterHeader from "../../components/table-sorter-header";
import {useRouter} from "next/router";
import {paths} from "../../../paths";
import Checkbox from "@mui/material/Checkbox";


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
            validate_package_xpath_sparql: true,
            validate_package_shacl: true
        },
        validationSchema: Yup.object({}),
        onSubmit: async (values, helpers) => {
            setIsProcessing(true)

            const tasks_to_run = [];
            if (values['transform_test_data']) {
                tasks_to_run.push('transform_test_data');
            }
            if (values['generate_cm_assertions']) {
                tasks_to_run.push('generate_cm_assertions');
            }
            if (values['validate_package']) {
                tasks_to_run.push('validate_package');
            }
            if (values['validate_package_xpath_sparql']) {
                tasks_to_run.push('validate_package_xpath');
                tasks_to_run.push('validate_package_sparql');
            }
            if (values['validate_package_shacl']) {
                tasks_to_run.push('validate_package_shacl');
            }
            const data = {
                package_id: item._id,
                project_id: sessionApi.getSessionProject(),
                use_latest_package_state: values['use_latest_package_state']
            }
            if (tasks_to_run.length > 0) {
                data.tasks_to_run = tasks_to_run.join(',');
            }
            const toastId = toastLoad(`Processing "${item.identifier}" ... This may take a while. Please, be patient.`)
            sectionApi.processPackage(data)
                .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
                .catch(err => toastError(err, toastId))
                .finally(() => setIsProcessing(false))
        }
    });

    const handleExport = itemId => {
        setIsExporting(true)
        const data = {
            package_id: item._id,
            project_id: sessionApi.getSessionProject()
        }
        const toastId = toastLoad(`Exporting "${item.identifier}" ... This may take a while. Please, be patient.`)
        sectionApi.exportPackage(data)
            .then(response => {
                saveAs(new Blob([response], {type: "application/x-zip-compressed"}), `${item.identifier}.zip`);
                toastSuccess(`"${item.identifier}" successfully exported.`, toastId)
            })
            .catch(err => toastError(err, toastId))
            .finally(() => setIsExporting(false))
    }

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
                            <Divider sx={{my: 2}}/>
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
                                                        checked={formik.values.validate_package_shacl && formik.values.validate_package}
                                                        disabled={!formik.values.validate_package}
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
                                                        checked={formik.values.validate_package_xpath_sparql && formik.values.validate_package}
                                                        disabled={!formik.values.validate_package}
                                                        onChange={(event) => formik.setFieldValue('validate_package_xpath_sparql', event.target.checked)}
                                                    />
                                                }
                                                label="XPATH / SPARQL"
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
                            onClick={handleExport}
                        >
                            {isExporting ? "Exporting Latest ..." : "Export Latest"}
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
        sort,
        onSort,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const [currentItem, setCurrentItem] = useState(null);
    const {timeSetting} = useGlobalState();
    const router = useRouter();

    const handleItemToggle = itemId => {
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);
    }

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 1 ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }

    const handleGoLastState = (id) => {
        sectionApi.getLatestState(id)
            .then(res => {
                router.push(paths.app[sectionApi.section].states.view(id, res._id))
            })
            .catch(err => console.error(err))
    }

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
                showFirstButton
                showLastButton
            >
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell width="25%">
                                    Title
                                </TableCell>
                                <TableCell>
                                    Identifier
                                </TableCell>
                                <TableCell align="left">
                                    Created
                                </TableCell>
                                <TableCell align="center">
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
                                                {timeTransformer(item.created_at, timeSetting)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction='row'
                                                       justifyContent='center'
                                                       alignItems='center'>
                                                    <Button type='link'
                                                            size="small"
                                                            onClick={() => handleGoLastState(item_id)}>
                                                        View Last State
                                                    </Button>
                                                    <ListItemActions
                                                        itemctx={new ForListItemAction(item_id, sectionApi)}
                                                    />
                                                </Stack>
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
            </TablePagination>
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
