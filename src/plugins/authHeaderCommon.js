export default function authHeaderCommon() {
    const user = JSON.parse(localStorage.getItem('activeUser'));
    if (user) {
        if (user.token) {
            return {
                Authorization: 'Bearer ' + user.token,
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };
        } 
    }
}
