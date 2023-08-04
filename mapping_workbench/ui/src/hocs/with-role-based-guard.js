import { RoleBasedGuard } from 'src/guards/role-based-guard';

export const withRoleBasedGuard = (Component) => {
    return function WithRoleBasedGuard(props) {
        return (
            <RoleBasedGuard>
                <Component {...props} />
            </RoleBasedGuard>
        );
    };
};
