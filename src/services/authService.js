import jwtDecode from 'jwt-decode';
import httpService from "./httpService";

const apiEndPoint = "auth";
const tokenKey = "token";

httpService.setJwt(getJwt());

export async function login(data) {

    // let instance = httpService.create();
    // delete instance.defaults.headers.common['Authorization'];

    const { data: jwt } = await httpService.post(`${apiEndPoint}/login`, data);
    localStorage.setItem(tokenKey, jwt);

    // instance.defaults.headers.common['Authorization'] = jwt.jwt;

}

export function logout() {
    localStorage.removeItem(tokenKey);
}

export function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    } catch (error) {
        return null
    }
}

export function resetPasswordSendMail(email) {
    return httpService.post(`users/reset-password`, email);
}

export function resetPassword(password, token) {
    return httpService.post(`users/reset-password-change`, { password }, { params: { token } });
}

export function getJwt() {
    return localStorage.getItem(tokenKey);
}

export default {
    login,
    loginWithJwt,
    logout,
    getCurrentUser,
    getJwt
}