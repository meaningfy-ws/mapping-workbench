import jwtDecode from "jwt-decode"
import * as moment from "moment"
import {STORAGE_KEY as ACCESS_TOKEN_STORAGE_KEY} from 'src/contexts/auth/jwt/auth-provider';

// every request is intercepted and has auth header injected.
export function localStorageTokenInterceptor(config) {
    let headers = {}
    const tokenString = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

    if (tokenString) {
        const token = JSON.parse(tokenString)
        const decodedAccessToken = jwtDecode(token.access_token)  // 1
        const isAccessTokenValid =
            moment.unix(decodedAccessToken.exp).toDate() > new Date()  // 2
        if (isAccessTokenValid) {
            headers["Authorization"] = `Bearer ${token.access_token}`  // 3
        } else {
            alert('Your login session has expired')
        }
    }
    config["headers"] = headers
    return config
}
