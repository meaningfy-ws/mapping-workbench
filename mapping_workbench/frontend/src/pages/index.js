import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {HomeApp} from 'src/sections/home/home-app';
import {Page as ProjectsPage} from 'src/pages/app/projects';


const Page = () => {
  usePageView();

  return (
    <>
      <Seo />
      <main>
        <HomeApp />
        <ProjectsPage />
      </main>
    </>
  );
};

Page.getLayout = (page) => (
  <AppLayout>
    {page}
  </AppLayout>
);

export default Page;
