import {useEffect} from "react";

import {authApi} from "../../../../api/auth";
import {appApi} from "../../../../api/app";
import {apiPaths, paths} from "../../../../paths";
import {securityApi} from "../../../../api/security";

const GoogleCallbackPage = () => {
    useEffect(() => {
        const authenticate = async () => {
            const res = await authApi.sendGoogleResponse(window.location.search);

            if (!res) {
                await appApi.signOut();
            } else {
                if (await appApi.authWithCheckUserIsVerified(res)) {
                    await authApi.initMyProfile();
                } else {
                    return false;
                }
            }
            window.location.replace(paths.app.index);
        };

        authenticate();
    }, []);
};

export default GoogleCallbackPage;
