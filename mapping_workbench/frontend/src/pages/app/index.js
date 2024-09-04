import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {useSettings} from 'src/hooks/use-settings';
import {Layout as AppLayout} from 'src/layouts/app';
import {HomeApp} from "../../sections/home/home-app";

const Page = () => {
    const settings = useSettings();

    usePageView();

    return (
        <>
            <Seo title="App: Overview"/>
            <HomeApp/>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
