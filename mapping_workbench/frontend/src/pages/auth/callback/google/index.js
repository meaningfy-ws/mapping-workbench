import {useEffect} from "react";

import {authApi} from "../../../../api/auth";
import {appApi} from "../../../../api/app";
import {paths} from "../../../../paths";

const GoogleCallbackPage = () => {
    useEffect(() => {
        const authenticate = async () => {
            const res = await authApi.sendGoogleResponse(window.location.search);
            if (!res) {
                await appApi.signOut();
            } else {
                appApi.authenticate(res);
                await authApi.initMyProfile();
            }
            window.location.replace(paths.app.index);
        };

        authenticate();
    }, []);
};

export default GoogleCallbackPage;
