import {Fragment, useState} from 'react';
import {useRouter} from "next/router";
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';
import {useFormik} from "formik";
import * as Yup from "yup";

import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import Box from "@mui/system/Box";
import Grid from '@mui/material/Grid';
import Card from "@mui/material/Card";
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Checkbox from "@mui/material/Checkbox";
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from "@mui/material/FormControlLabel";

import {paths} from "src/paths";
import {sessionApi} from "src/api/session";
import {Scrollbar} from 'src/components/scrollbar';
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import ConfirmDialog from "src/components/app/dialog/confirm-dialog";
import TablePagination from "src/sections/components/table-pagination";
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';


const PackageRow = ({item, sectionApi}) => {

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

                if (values['validate_package_xpath_sparql']) {
                    tasks_to_run.push('validate_package_xpath');
                    tasks_to_run.push('validate_package_sparql');
                }
                if (values['validate_package_shacl']) {
                    tasks_to_run.push('validate_package_shacl');
                }
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
                <Alert severity="warning"
                       sx={{mt: 3, mx: 3}}>
                    {"Do not modify Project's Resources while the Mapping Package Processing task is initializing."}
                </Alert>
                {isProcessing && <Alert severity="warning"
                                        sx={{mt: 1, mx: 3}}>
                    <b>Mapping Package Processing task is initializing!</b>
                </Alert>}
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

const MappingPackageRowFragment = (props) => {
    const {
        item_id, item, isCurrent, handleItemToggle, handleGoLastState, handleDeleteAction, timeSetting, sectionApi
    } = props;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cleanupProject, setCleanupProject] = useState(false);

    return (
        <>
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
                                    id='view_last_state_button'
                                    size="small"
                                    onClick={() => handleGoLastState(item_id)}>
                                View Last State
                            </Button>
                            <ListItemActions
                                itemctx={new ForListItemAction(item_id, sectionApi)}
                            />
                            <Button
                                id="delete_button"
                                variant="text"
                                size="small"
                                color="error"
                                onClick={() => setConfirmOpen(true)}
                                sx={{
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Delete
                            </Button>
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
            <ConfirmDialog
                title="Delete It?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => handleDeleteAction(item_id, cleanupProject)}
                footer={<Box sx={{
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={cleanupProject}
                                onChange={(e) => {
                                    setCleanupProject(e.target.checked)
                                }}
                            />
                        }
                        label="Cleanup Project Resources"
                        value="cleanup_project"
                    />
                </Box>}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
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

    const [currentItem, setCurrentItem] = useState(null);
    const {timeSetting} = useGlobalState();
    const router = useRouter();

    const handleItemToggle = itemId => {
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);
    }

    const handleGoLastState = (id) => {
        sectionApi.getLatestState(id)
            .then(res => {
                router.push(paths.app[sectionApi.section].states.view(id, res._id))
            })
            .catch(err => toastError(err))
    }

    const handleDeleteAction = (id, cleanup_project = false) => {
        sectionApi.deleteMappingPackageWithCleanup(id, cleanup_project)
            .finally(() => {
                    router.push({pathname: paths.app[sectionApi.section].index});
                    router.reload()
                }
            )
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

                                return (
                                    <MappingPackageRowFragment
                                        key={item_id}
                                        item_id={item_id}
                                        item={item}
                                        isCurrent={isCurrent}
                                        handleItemToggle={handleItemToggle}
                                        handleGoLastState={handleGoLastState}
                                        handleDeleteAction={handleDeleteAction}
                                        timeSetting={timeSetting}
                                        sectionApi={sectionApi}
                                    />
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
    rowsPerPage: PropTypes.number,
    sectionApi: PropTypes.object
};

PackageRow.propTypes = {
    item: PropTypes.object,
    sectionApi: PropTypes.object
}

MappingPackageRowFragment.propTypes = {
    item_id: PropTypes.number,
    item: PropTypes.object,
    isCurrent: PropTypes.bool,
    handleItemToggle: PropTypes.func,
    handleGoLastState: PropTypes.func,
    handleDeleteAction: PropTypes.func,
    timeSetting: PropTypes.object,
    sectionApi: PropTypes.object
}