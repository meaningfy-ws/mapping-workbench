import {AuthGuard} from 'src/guards/auth-guard';
import {AuthProvider} from "../contexts/auth/jwt";

export const withAuthGuard = (Component) => {
    //TODO: here a call must be provided to API endpoints users/me to check that the authenticated user is active
    return function WithAuthGuard(props) {
        return (
            <AuthGuard>
                <Component {...props} />
            </AuthGuard>
        );
    };
};
