export function authHeader() {
    let accessToken = JSON.parse(sessionStorage.getItem('accessToken'));
    if (accessToken) {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        };
    } else {
        return {};
    }
}
