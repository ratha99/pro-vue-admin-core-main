export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('activeUser'));
    if (user) {
        if (user.accessToken) {
            return {
                Authorization: 'Bearer ' + user.accessToken,
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                //'Content-Type': 'multipart/form-data'
            };
        } 
    }
}
