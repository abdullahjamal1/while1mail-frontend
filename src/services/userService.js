import { getJwt } from './authService';
import http from './httpService';
const apiEndPoint = "/users/register";

export function register(user) {
    return http.post(apiEndPoint, user);
}

function userUrl(id) {
    return `/users/${id}`;
}

export function getUser(id) {
    return http.get(userUrl(id));
}

export function getLoggedUser(){
    return http.get('/users/me');
}

export function getAllUsers() {
    return http.get("/users");
}

export function deleteUser(id) {
    return http.delete(userUrl(id));
}

export function updateUser(id, user) {
    return http.put(userUrl(id), user);
}

export function getDefaultAvatar({ target }) {
    target.src = `${process.env.REACT_APP_S3_URL}default/images/user_avatar.jpg`;
}

export function getAvatar(userId) {
    return `${process.env.REACT_APP_S3_URL}users/${userId}/${userId}.jpg`;
}