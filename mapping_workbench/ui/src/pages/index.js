import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as AppLayout } from 'src/layouts/app';
import { HomeCta } from 'src/sections/home/home-cta';
import { HomeFaqs } from 'src/sections/home/home-faqs';
import { HomeFeatures } from 'src/sections/home/home-features';
import { HomeHero } from 'src/sections/home/home-hero';
import { HomeReviews } from 'src/sections/home/home-reviews';
import { withAuthGuard } from '../hocs/with-auth-guard';


const Page = () => {
  usePageView();

  return (
    <>
      <Seo />
      <main>
        <HomeHero />
        <HomeFeatures />
        <HomeReviews />
        <HomeCta />
        <HomeFaqs />
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
