/**
 * Created by i82325 on 5/7/2019.
 */
import {authHeader} from '../helper/auth-header';
import {handleResponse} from './ResponseService';

export const userService = {
    login,
    logout,
    getAll,
    createUser,
    deleteUser,
    getUser,
    updateUser,
    changePassword,
    getUserByEmail
};

async function login(userName, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName, password}) //this is for post request
    };

    const response = await fetch('http://localhost:3601/auth', requestOptions);
    const requestData = await handleResponse(response);
    if (requestData.accessToken) {
        sessionStorage.setItem('user', JSON.stringify(requestData.name));
        sessionStorage.setItem('userId', JSON.stringify(requestData.id));
        sessionStorage.setItem('accessToken', JSON.stringify(requestData.accessToken));
        sessionStorage.setItem('refreshToken', JSON.stringify(requestData.refreshToken));
        sessionStorage.setItem('permissionLevel', JSON.stringify(requestData.permissionLevel));
    }
    return true;
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('permissionLevel');
    window.location.reload();
}

async function getAll() {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch('http://localhost:3601/users?limit=9999', requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function getUser(_id) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch('http://localhost:3601/users/' + _id, requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function getUserByEmail(email) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',}
        };

        const response = await fetch('http://localhost:3601/users/' + email, requestOptions);
        return handleResponse(response);
}


async function createUser(userObject) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify(userObject)
        };
        const response = await fetch('http://localhost:3601/users', requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function deleteUser(_id) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader()
        };

        const response = await fetch('http://localhost:3601/users/' + _id, requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function updateUser(userObject) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'PATCH',
            headers: authHeader(),
            body: JSON.stringify(userObject)
        };
        console.log(userObject);
        const response = await fetch('http://localhost:3601/users/' + userObject._id, requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function changePassword(_id, oldPassword, newPassword) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'PATCH',
            headers: authHeader(),
            body: JSON.stringify({oldPassword, newPassword})
        };

        const response = await fetch('http://localhost:3601/users/changePassword/' + _id, requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function getAccessToken() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({refresh_token: JSON.parse(sessionStorage.getItem('refreshToken'))}) //this is for post request
    };

    await fetch('http://localhost:3601/auth/refresh', requestOptions)
        .then(handleResponse)
        .then(response => {
            sessionStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
            sessionStorage.setItem('accessToken', JSON.stringify(response.accessToken));
        });
}