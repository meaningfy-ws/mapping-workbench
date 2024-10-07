class SecurityApi {
    hasUserRole(user, role) {
        return user?.roles?.includes(role);
    }

    isUserSuper(user) {
        return !!user?.is_superuser;
    }

    isUserAdmin(user) {
        return this.isUserSuper(user) || this.hasUserRole(user, 'admin');
    }

    isAuthUser(user, id) {
        return user?.id === id;
    }

    isUserActive(user) {
        return !!user?.is_active;
    }

    isUserVerified(user) {
        return !!user?.is_verified;
    }

    isUserAuthorized(user) {
        return this.isUserSuper(user) || (this.isUserActive(user) && this.isUserVerified(user));
    }
}

export const securityApi = new SecurityApi();
