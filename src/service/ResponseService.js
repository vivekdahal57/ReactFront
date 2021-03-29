/**
 * Created by i82325 on 5/31/2019.
 */
export const handleResponse = function (response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('refreshToken');
                sessionStorage.removeItem('userName');
                sessionStorage.removeItem('role');
                window.location.reload();
            }
            console.log(data);
            const error = (data && data.error) || response.status;
            return Promise.reject(error);
        }
        return data;
    });
};