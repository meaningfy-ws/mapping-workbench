

import {GuestGuard} from 'src/guards/guest-guard';
import {IssuerGuard} from 'src/guards/issuer-guard';

import {usePageView} from 'src/hooks/use-page-view';

import {Layout as AuthLayout} from 'src/layouts/auth/classic-layout';
import {Issuer} from 'src/utils/auth';

import { useSession, signIn, signOut } from 'next-auth/react';

const Page = () => {
    const { data, status } = useSession();


    usePageView();
if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'authenticated') {
    return (
      <div>
        {/*<h1> hi {data.user.name}</h1>*/}
        {/*<img src={data.user.image}*/}
        {/*     alt={data.user.name + ' photo'} />*/}
        <button onClick={signOut}>sign out</button>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => signIn('google')}>sign in with gooogle</button>
    </div>)
};

Page.getLayout = (page) => (
    // <IssuerGuard issuer={Issuer.JWT}>
    //     <GuestGuard>
            <AuthLayout>
                {page}
            </AuthLayout>
        // </GuestGuard>
    // </IssuerGuard>
);

export default Page;
