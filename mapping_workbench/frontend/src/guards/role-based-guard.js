import PropTypes from "prop-types";
import {useAuth} from "../hooks/use-auth";

export const  RoleBasedGuard = (props) => {
    const { children, permissions } = props;
    const { user } = useAuth();

    // Here check the user permissions
    const canView = true;

    if (!canView) {
        return null;
    }

    return <>{children}</>;
};


RoleBasedGuard.propTypes = {
    children: PropTypes.node
};