import {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";

import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useDialog} from "src/hooks/use-dialog";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ListTable} from "src/sections/app/generic-triple-map-fragment/list-table";
import {FileUploader} from "src/sections/app/generic-triple-map-fragment/file-uploader";
import {specificTripleMapFragmentsApi as sectionApi} from 'src/api/triple-map-fragments/specific';
import useItemsSearch from '../../../hooks/use-items-search';

const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems({rowsPerPage: -1})
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count
                }))
            .catch(err => console.warn(err))
    }

    useEffect(() => {
        handleItemsGet();
    }, []);

    return {
        ...state
    };
};


const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['triple_map_uri']);

    const uploadDialog = useDialog();

    usePageView();

    const uploadFormik = useFormik({
        initialValues: {
            mapping_package_id: ''
        },
        validationSchema: Yup.object({
            mapping_package_id: Yup
                    .string()
                    .required('Mapping Package is required'),
        })
    });

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
                            {sectionApi.SECTION_TITLE}
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
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <SvgIcon>
                                    <UploadIcon/>
                                </SvgIcon>
                            )}
                            id="upload_fragment_button"
                            variant="contained"
                        >
                            Upload
                        </Button>
                        <Button
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
                                </SvgIcon>
                            )}
                            id="add_button"
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}/>
                    <Divider/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsSearch.count}
                        onSort={itemsSearch.handleSort}
                        sort={itemsSearch.state.sort}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                    />
                </Card>
                <FileUploader
                    onClose={uploadDialog.handleClose}
                    open={uploadDialog.open}
                    sectionApi={sectionApi}
                    formik={uploadFormik}
                />
            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
