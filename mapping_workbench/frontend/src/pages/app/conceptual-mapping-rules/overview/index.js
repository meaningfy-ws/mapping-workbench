import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import {DataGrid, useGridApiContext, useGridApiEventHandler} from '@mui/x-data-grid';
import parse from 'html-react-parser';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {useTranslation} from "react-i18next";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import * as Yup from 'yup';

import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from "@mui/material/Alert";
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {tokens} from "/src/locales/tokens";
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {Filter} from 'src/sections/components/filter';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {TableSearchBar} from 'src/sections/components/table-search-bar';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {toastError, toastLoad, toastSuccess} from 'src/components/app-toast';
import {ListTable} from "src/sections/app/conceptual-mapping-rule/list-table";
import {COMMENT_PRIORITY, conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import {MappingPackageFormSelect} from 'src/sections/app/mapping-package/components/mapping-package-form-select';
import {mappingPackagesApi} from '../../../../api/mapping-packages';
import {sparqlTestFileResourcesApi} from '../../../../api/sparql-test-suites/file-resources';
import {genericTripleMapFragmentsApi} from '../../../../api/triple-map-fragments/generic';
import ConfirmDialog from '../../../../components/app/dialog/confirm-dialog';
import {ListItemActions} from '../../../../components/app/list/list-item-actions';
import {ForListItemAction} from '../../../../contexts/app/section/for-list-item-action';
import {CmOverviewDialog} from '../../../../sections/app/conceptual-mapping-rule/develop/cm-overview-dialog';
import {
    ListTableMappingPackages
} from '../../../../sections/app/conceptual-mapping-rule/overview/list-table-mapping-packages';
import {
    ListTableSPARQLAssertions
} from '../../../../sections/app/conceptual-mapping-rule/overview/list-table-sparql-assertions';
import {
    ListTableTripleMapFragment
} from '../../../../sections/app/conceptual-mapping-rule/overview/list-table-triple-map-fragment';

const TRUNCATE_LENGTH = 35;

const useHovered = () => {
    const [hoveredId, setHoveredId] = useState(null)

    const apiRef = useGridApiContext();

    useGridApiEventHandler(apiRef, "rowMouseEnter", ({id}) => setHoveredId(id));
    useGridApiEventHandler(apiRef, "rowMouseLeave", () => setHoveredId(null));

    return hoveredId
}

const CustomElement = ({id, row, init}) => {

    const hoveredId = useHovered(id)

    return (

        <Box>
            <ListTableTripleMapFragment
                item={row}
                initProjectTripleMapFragments={init}
                isHovered={id === hoveredId}
                // isHovered={isHovered}
            />
        </Box>
    )
}

const CustomElement2 = ({id, row, init}) => {

    const hoveredId = useHovered(id)

    return (

        <Box>
            <ListTableMappingPackages
                item={row}
                initProjectMappingPackages={init}
                isHovered={id === hoveredId}
                // isHovered={isHovered}
            />
        </Box>
    )
}

const CustomElement3 = ({id, row, init}) => {

    const hoveredId = useHovered(id)

    return (

        <Box>
            <ListTableSPARQLAssertions
                item={row}
                initProjectSPARQLResources={init}
                isHovered={id === hoveredId}
            />
        </Box>
    )
}


const RuleComment = (props) => {
    const {comment, ...other} = props;

    let severity;
    switch (comment.priority) {
        case COMMENT_PRIORITY.HIGH:
            severity = 'error';
            break;
        case COMMENT_PRIORITY.LOW:
            severity = 'info';
            break;
        default:
            severity = 'success';
            break;
    }

    return (
        <Alert severity={severity}
               sx={{
                   my: 2
               }}
        >
            <Box>
                {comment.title && <Box><b>{comment.title}</b></Box>}

                <Box>{comment.comment}</Box>
            </Box>
        </Alert>
    )
}

const Page = () => {
        const [detailedView, setDetailedView] = useState(true)
        const {t} = useTranslation();
        const router = useRouter();
        const notesDialog = useDialog()
        const cmOverviewDialog = useDialog()
        const itemsStore = useItemsStore(sectionApi);

        const generateSHACLDialog = useDialog();
        const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);
        const [projectMappingPackages, setProjectMappingPackages] = useState([]);
        const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);


        useEffect(() => {
            sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions()
                .then(res => setProjectSPARQLResources(res))
                .catch(err => console.error(err))


            mappingPackagesApi.getProjectPackages()
                .then(res => setProjectMappingPackages(res))
                .catch(err => console.error(err))

            genericTripleMapFragmentsApi.getValuesForSelector()
                .then(res => setProjectTripleMapFragments(res))
                .catch(err => console.error(err))
        }, [])

        const handleViewAction = (item_id) => {
            router.push({
                pathname: paths.app[sectionApi.section].view,
                query: {id: item_id}
            });
        }


        const generateValidityInfo = (termsValidity, pathName, pathValue) => {
            let validityInfo = pathValue;
            if (!termsValidity) {
                return validityInfo;
            }
            for (const termValidity of termsValidity) {
                const color = termValidity.is_valid ? 'green' : 'red'
                validityInfo = validityInfo.replace(
                    new RegExp(termValidity.term, 'g'),
                    `<b style="color: ${color}">${termValidity.term}</b>`
                )
            }

            return validityInfo;
        }


        const hasTargetPropertyPathValidityErrors = (target_property_path_terms_validity) =>
            target_property_path_terms_validity?.some(x => !x.is_valid);

        const hasTargetClassPathValidityErrors = (target_class_path_terms_validity) =>
            target_class_path_terms_validity?.some(x => !x.is_valid);

        const targetClassPathValidityInfo = (target_class_path_terms_validity, target_class_path) => generateValidityInfo(
            target_class_path_terms_validity,
            "target_class_path",
            target_class_path
        );

        const targetPropertyPathValidityInfo = (target_property_path_terms_validity, target_property_path) => generateValidityInfo(
            target_property_path_terms_validity,
            "target_property_path",
            target_property_path
        );

        const columns = [
            {
                display: 'flex', align: 'center',
                renderCell: ({row}) =>
                    <IconButton onClick={() => cmOverviewDialog.handleOpen(row)}
                                disabled={!row.source_structural_element
                                    && !row.target_class_path_terms_validity?.length
                                    && !row.target_property_path_terms_validity}>
                        <FormatListBulletedIcon/>
                    </IconButton>
            },
            {
                field: 'sort_order', headerName: 'CM Rule Order', display: 'flex', align: 'center'
            },
            {
                field: 'source_structural_element', headerName: 'Conceptual Field/Group', width: 160, height: 'auto',
                display: 'flex', align: 'center',
                renderCell: ({id, row}) => <>
                    <Link onClick={() => handleViewAction(id)}
                          sx={{cursor: "pointer"}}
                          color="primary"
                    >
                        <Typography variant="subtitle2">
                            <Box>
                                {row.source_structural_element?.sdk_element_id}
                                {row.mapping_group_id && ` / ${row.mapping_group_id}`}
                            </Box>
                        </Typography>
                    </Link>
                    {row.source_structural_element?.name}</>
            },
            {
                field: 'min_sdk_version', headerName: 'Min XSD', width: 90
            },
            {
                field: 'max_sdk_version', headerName: 'Max XSD', width: 90
            },
            {
                field: 'target_class_path', headerName: 'Ontology Fragment Class Path', flex: 1,
                renderCell: ({row}) =>
                    <Box title={row.target_class_path}
                         sx={{my: 1}}>
                        {detailedView && row.target_class_path &&
                            <Alert
                                severity={hasTargetClassPathValidityErrors(row.target_class_path_terms_validity) ? "error" : "success"}>
                                {parse(targetClassPathValidityInfo(row.target_class_path_terms_validity, row.target_class_path))}
                            </Alert>}
                        {!detailedView && (
                            <>
                                {row.target_class_path?.length > TRUNCATE_LENGTH && "..."}
                                {row.target_class_path?.substring(row.target_class_path.length - TRUNCATE_LENGTH)}
                            </>
                        )}
                    </Box>
            },
            {
                field: 'target_property_path', headerName: 'Ontology Fragment Property Path', flex: 1,
                renderCell: ({row}) =>
                    <Box title={row.target_property_path}
                         sx={{my: 1}}>
                        {detailedView && row.target_property_path &&
                            <Alert severity={hasTargetPropertyPathValidityErrors ? "error" : "success"}>
                                {parse(targetPropertyPathValidityInfo(row.target_property_path_terms_validity, row.target_property_path))}
                            </Alert>}
                        {!detailedView && (
                            <>
                                {row.target_property_path?.length > TRUNCATE_LENGTH && "..."}
                                {row.target_property_path?.substring(row.target_property_path.length - TRUNCATE_LENGTH)}
                            </>
                        )}
                    </Box>
            },
            {
                field: 'mp',
                headerName: 'Rml Triple Map',
                display: 'flex',
                align: 'center',
                renderCell: ({id, row}) => <CustomElement id={id}
                                                          row={row}
                                                          init={projectTripleMapFragments}/>
            },
            {
                field: 'mp0',
                headerName: 'Mapping Package',
                width: 300,
                display: 'flex',
                align: 'center',
                renderCell: ({id, row}) => <CustomElement2 id={id}
                                                           row={row}
                                                           init={projectMappingPackages}/>
            },
            {
                field: 'mp1',
                headerName: 'SPARQL Assertions',
                display: 'flex',
                align: 'center',
                renderCell: ({id, row}) => <CustomElement3 id={id}
                                                           row={row}
                                                           init={projectSPARQLResources}/>
            },
            {
                field: 'notesCount',
                headerName: 'Notices',
                display: 'flex',
                align: 'center',
                width: 90,
                sortable: false,
                filterable: false,
                renderCell: ({row}) => {
                    const notesCount = (row.mapping_notes?.length ?? 0) + (row.editorial_notes?.length ?? 0) + (row.feedback_notes?.length ?? 0)
                    return !!notesCount &&
                        <Button variant="text"
                                size="small"
                                color="warning"
                                onClick={() => notesDialog.handleOpen(row)}>
                            {notesCount}
                        </Button>
                }
            },
            {
                field: 'id',
                headerName: 'Action',
                display: 'flex',
                align: 'center',
                width: 200,
                sortable: false,
                filterable: false,
                renderCell: ({id, row}) => <ListItemActions
                    itemctx={new ForListItemAction(id, sectionApi)}
                    pathnames={{
                        delete_after_path: () => paths.app.conceptual_mapping_rules.overview
                    }}
                />
            },
        ]

        const initialValues = {
            close_shacl: true,
            mapping_package_id: '',
        };

        const formik = useFormik({
            initialValues,
            validationSchema: Yup.object({}),
            onSubmit: (values, helpers) => {
                const toastId = toastLoad("Generating SHACL Shapes...")
                helpers.setSubmitting(true)
                values.mapping_package_id = values.mapping_package_id ? values.mapping_package_id : null;
                sectionApi.generateSHACL(values)
                    .then((res) => {
                        helpers.setStatus({success: true});
                        toastSuccess(`${res.task_name} successfully started.`, toastId)
                    })
                    .catch(err => {
                        console.log(err)
                        helpers.setStatus({success: false});
                        helpers.setErrors({submit: err.message});
                        toastError(`SHACL Shapes Generator failed: ${err.message}.`, toastId);
                    })
                    .finally(res => {
                        helpers.setSubmitting(false);
                        generateSHACLDialog.handleClose();
                    });
            }
        });


        usePageView();

        return (
            <>
                <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
                <Stack spacing={4}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h4">
                                Overview {sectionApi.SECTION_TITLE}
                            </Typography>
                            <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={paths.index}
                                    variant="subtitle2"
                                >
                                    App
                                </Link>
                                <Typography
                                    color="text.secondary"
                                    variant="subtitle2"
                                >
                                    Overview {sectionApi.SECTION_TITLE}
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={3}
                        >
                            <Button id="generate_shacl_button"
                                    onClick={generateSHACLDialog.handleOpen}>
                                Generate SHACL
                            </Button>
                            <Button
                                component={RouterLink}
                                href={paths.app[sectionApi.section].overview.create}
                                id="add-mapping-rules-button"
                                startIcon={(
                                    <SvgIcon>
                                        <AddIcon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Add
                            </Button>
                            <Button
                                id="generate_button"
                                component={RouterLink}
                                href={paths.app[sectionApi.section].tasks.generate_cm_assertions_queries}
                                startIcon={(
                                    <SvgIcon>
                                        <CachedIcon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                {t(tokens.nav.generate_cm_assertions_queries)}
                            </Button>
                        </Stack>
                    </Stack>
                    <Card>
                        <Stack direction='row'
                               padding={3}>
                            <FormControlLabel control={<Switch checked={detailedView}
                                                               onChange={e => setDetailedView(e.target.checked)}/>}
                                              label='Detailed View'/>
                        </Stack>
                        {/*<TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}*/}
                        {/*                value={itemsSearch.state.search[0]}/>*/}
                        {/*<Divider/>*/}
                        {/*<Stack direction='row'*/}
                        {/*       padding={3}>*/}
                        {/*    <FormControlLabel control={<Switch checked={detailedView}*/}
                        {/*                                       onChange={e => setDetailedView(e.target.checked)}/>}*/}
                        {/*                      label='Detailed View'/>*/}
                        {/*    <Paper variant='outlined'>*/}
                        {/*        <Filter title={'Terms:'}*/}
                        {/*                values={filterValues}*/}
                        {/*                value={itemsSearch.state.filters.terms}*/}
                        {/*                onValueChange={e => itemsSearch.handleFiltersChange({terms: e})}/>*/}
                        {/*    </Paper>*/}
                        {/*</Stack>*/}
                        {/*<Divider/>*/}
                        {/*<ListTable*/}
                        {/*    sectionApi={sectionApi}*/}
                        {/*    items={itemsSearch.pagedItems}*/}
                        {/*    count={itemsSearch.count}*/}
                        {/*    detailedView={detailedView}*/}
                        {/*    page={itemsSearch.state.page}*/}
                        {/*    onPageChange={itemsSearch.handlePageChange}*/}
                        {/*    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}*/}
                        {/*    rowsPerPage={itemsSearch.state.rowsPerPage}*/}
                        {/*    onSort={itemsSearch.handleSort}*/}
                        {/*    sort={itemsSearch.state.sort}*/}
                        {/*/>*/}
                        <CmOverviewDialog id='cm_overview_dialog'
                                          handleClose={cmOverviewDialog.handleClose}
                                          open={cmOverviewDialog.open}
                                          item={cmOverviewDialog.data}/>
                        <Dialog id='notes_dialog'
                                onClose={notesDialog.handleClose}
                                open={notesDialog.open}
                                fullWidth
                                maxWidth="md"
                        >
                            <Card>
                                <CardHeader title="Notes"
                                            sx={{mb: 2}}/>
                                <Divider/>
                                <CardContent sx={{pt: 1}}>
                                    <Box style={{overflow: 'auto', maxHeight: '40vh'}}>
                                        {notesDialog.data?.mapping_notes && <>
                                            <Typography>Mapping Notes:</Typography>
                                            {notesDialog.data.mapping_notes.map((mapping_note, i) => <RuleComment
                                                    key={'mapping_note' + i}
                                                    comment={mapping_note}
                                                />
                                            )}
                                        </>}
                                        <Divider sx={{my: 2}}/>
                                        {notesDialog.data?.editorial_notes && <>
                                            <Typography>Editorial Notes:</Typography>
                                            {notesDialog.data.editorial_notes.map((editorial_note, i) => <RuleComment
                                                    key={'editorial_notes' + i}
                                                    comment={editorial_note}
                                                />
                                            )}
                                        </>}
                                        <Divider sx={{my: 2}}/>
                                        {notesDialog.data?.feedback_notes && <>
                                            <Typography>Feedback Notes:</Typography>
                                            {notesDialog.data.feedback_notes.map((feedback_note, i) =>
                                                <RuleComment key={'feedback_notes' + i}
                                                             comment={feedback_note}/>
                                            )}
                                        </>}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Dialog>
                        <DataGrid getRowHeight={() => 'auto'}
                                  getRowId={row => row._id}
                                  rows={itemsStore.items}
                                  columns={columns}
                                  slotProps={{
                                      pagination: {
                                          showFirstButton: true,
                                          showLastButton: true,
                                      }
                                  }}
                                  initialState={{
                                      pagination: {
                                          paginationModel: {
                                              pageSize: sectionApi.DEFAULT_ROWS_PER_PAGE,
                                          },
                                      },
                                  }}
                                  pageSizeOptions={[5, 10, 25, 100]}
                                  disableRowSelectionOnClick
                        />
                    </Card>
                    <Dialog id='shacl_generate_dialog'
                            open={generateSHACLDialog.open}
                            onClose={generateSHACLDialog.handleClose}
                            fullWidth
                            maxWidth="sm">
                        <form onSubmit={formik.handleSubmit}>
                            <Stack
                                spacing={3}
                                sx={{px: 3, py: 2}}>
                                <Typography variant="h6">
                                    SHACL Shapes Generator
                                </Typography>
                                <Alert severity="info">
                                    Select the Mapping Package to use needed resources from or leave empty to use all Project's resources
                                </Alert>
                                <MappingPackageFormSelect
                                    formik={formik}
                                    disabled={formik.isSubmitting}
                                    isRequired={false}
                                />
                                <Divider/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.close_shacl}
                                            onChange={(e) => {
                                                formik.setFieldValue('close_shacl', e.target.checked)
                                            }}
                                        />
                                    }
                                    disabled={formik.isSubmitting}
                                    label="Close SHACL Shapes"
                                    value="close_shacl"
                                />
                                <LoadingButton type='submit'
                                               variant="contained"
                                               fullWidth
                                               size="small"
                                               color="success"
                                               loading={formik.isSubmitting}
                                >
                                    Generate
                                </LoadingButton>
                            </Stack>
                        </form>
                    </Dialog>
                </Stack>
            </>
        );
    }
;

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
