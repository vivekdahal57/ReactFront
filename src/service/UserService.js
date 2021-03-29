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
    getUserByEmail,
    getAccessToken,
    getUserByUname
};

async function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}) //this is for post request
    };

    const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/authenticate', requestOptions);
    const requestData = await handleResponse(response);
    if (requestData.token) {
        sessionStorage.setItem('userName', JSON.stringify(requestData.userName));
        sessionStorage.setItem('token', JSON.stringify(requestData.token));
        sessionStorage.setItem('role', JSON.stringify(requestData.role));
        sessionStorage.setItem('refreshToken', JSON.stringify(requestData.token));
        return requestData;
    }
    return handleResponse(response);
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('refreshToken');
    window.location.reload();
}

async function getAll() {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users?limit=9999', requestOptions);
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

        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users/' + _id, requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function getUserByUname(userName) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users/' + userName, requestOptions);
        return handleResponse(response);
    }
    return null;
}


async function getUserByEmail(email) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users/' + email, requestOptions);
    return handleResponse(response);
}


async function createUser(userObject) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify(userObject)
        };
        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users', requestOptions);
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

        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users/' + _id, requestOptions);
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
        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users', requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function changePassword(userName, oldPassword, newPassword) {
    if (getAccessToken()) {
        const requestOptions = {
            method: 'PATCH',
            headers: authHeader(),
            body: JSON.stringify({userName, oldPassword, newPassword})
        };

        const response = await fetch('http://127.0.0.1:8080/api/v1/CMS/users/changePassword', requestOptions);
        return handleResponse(response);
    }
    return null;
}

async function getAccessToken() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({refresh_token: JSON.parse(sessionStorage.getItem('token'))}) //this is for post request
    };

    await fetch('http://127.0.0.1:8080/api/v1/CMS/refresh', requestOptions)
        .then(handleResponse)
        .then(response => {
            sessionStorage.setItem('refreshToken', JSON.stringify(response.token));
        });
}