import {AuthGuard} from 'src/guards/auth-guard';
import {authApi} from "src/api/auth";

export const withAuthGuard = (Component) => {
    // let userResult = null;
    // authApi.me().then(result => {
    //     userResult = result;
    // }).catch(function (error) {
    //     console.log(error);
    //     throw new Error(error.message);
    // });
    //
    // console.log("USER :: ", userResult);

    return function WithAuthGuard(props) {
        return (
            <AuthGuard>
                <Component {...props} />
            </AuthGuard>
        );
    };
};
