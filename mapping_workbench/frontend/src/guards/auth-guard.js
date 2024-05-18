import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {useAuth} from 'src/hooks/use-auth';
import {useRouter} from 'src/hooks/use-router';
import {paths} from 'src/paths';
import {Issuer} from 'src/utils/auth';
import {useSession} from "next-auth/react";

const loginPaths = {
  [Issuer.Auth0]: paths.auth.auth0.login,
  [Issuer.JWT]: paths.auth.jwt.login
};

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const auth = useAuth();
  const {data} = useSession();
  const [checked, setChecked] = useState(false);
  const check = async () => {
    //await auth.verifyAuth();
    if (!auth.isAuthenticated || (data && !data.user)) {
      const searchParams = new URLSearchParams({ returnTo: window.location.pathname }).toString();
      const href = loginPaths[auth.issuer] + `?${searchParams}`;
      await router.replace(href);
    } else {
      setChecked(true);
    }
  }

  // Only check on mount, this allows us to redirect the user manually when auth state changes
  useEffect(() => {
      check();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
