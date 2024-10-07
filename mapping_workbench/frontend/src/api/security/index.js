class SecurityApi {
    hasUserRole(user, role) {
        return user?.roles?.includes(role);
    }

    isUserAdmin(user) {
        return user?.is_superuser || this.hasUserRole(user, 'admin');
    }

    isAuthUser(user, id) {
        return user?.id === id;
    }
}

export const securityApi = new SecurityApi();
