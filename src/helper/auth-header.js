export function authHeader() {
    let accessToken = JSON.parse(sessionStorage.getItem('token'));
    if (accessToken) {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        };
    } else {
        return {};
    }
}
