import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {fieldsRegistryApi as sectionApi} from 'src/api/fields-registry';
import {Layout as AppLayout} from 'src/layouts/app';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import TreeView from "../../../../sections/app/tree-view/tree-view";


export const Page = () => {

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TREE_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.SECTION_TREE_TITLE}
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
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.app.fields_registry.elements.tree_view.index}
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TREE_TITLE}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    {/*<Stack*/}
                    {/*    alignItems="center"*/}
                    {/*    direction="row"*/}
                    {/*    spacing={3}*/}
                    {/*>*/}
                    {/*    <Button*/}
                    {/*        id="refresh_button"*/}
                    {/*        color="inherit"*/}
                    {/*        startIcon={<SvgIcon><AutorenewIcon/></SvgIcon>}*/}
                    {/*        variant="contained"*/}
                    {/*        onClick={handleItemsGet}*/}
                    {/*    >*/}
                    {/*        Refresh*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*        id="delete_all_button"*/}
                    {/*        color="error"*/}
                    {/*        startIcon={<SvgIcon><DeleteOutlineIcon/></SvgIcon>}*/}
                    {/*        variant="contained"*/}
                    {/*        onClick={handleDeleteAllTasks}*/}
                    {/*    >*/}
                    {/*        Delete All Tasks*/}
                    {/*    </Button>*/}
                    {/*</Stack>*/}
                </Stack>
                <Card>
                    <TreeView sectionApi={sectionApi}/>
                </Card>
            </Stack>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
