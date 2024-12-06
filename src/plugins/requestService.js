import axios from "axios";
import authHeader from "./authHeader";
import authHeaderCommon from "./authHeaderCommon";

//const API_URL = "https://dummyjson.com/";
//const API_URL = "http://172.16.3.39/api/v1/";
// const API_URL = "http://103.16.62.58:86/web/api/v1/";
// const API_COMMON_URL = "http://103.16.62.58:86/api/v1/";

const API_URL = "http://localhost:3000/v1/";
const API_COMMON_URL = "http://localhost:3000/v1/"; 

// const API_URL = "http://152.42.250.99:3000/v1/";
// const API_COMMON_URL = "http://152.42.250.99:3000/v1/"; 
//common url
const common_get = (endpoint) => {
    return axios.get(API_COMMON_URL + endpoint, { headers: authHeader() });
}; 

const common_post = (endpoint, data) => {
    return axios.post(API_COMMON_URL + endpoint, data, { headers: authHeader() });
};

const common_update = (endpoint, data) => {
    console.log(data);
    return axios.put(API_COMMON_URL + endpoint, data, { headers: authHeaderCommon() });
};

const common_remove = (endpoint) => {
    return axios.delete(API_COMMON_URL + endpoint, { headers: authHeader() });
};

const get_data = (endpoint,data) => {
    return axios.get(API_URL + endpoint, {
       params: data,
       headers: authHeader() });
};

const get = (endpoint) => {
    return axios.get(API_URL + endpoint, { headers: authHeader() });
};

const post = (endpoint, data) => {
    return axios.post(API_URL + endpoint, data, { headers: authHeader() });
};

const update = (endpoint, data) => {
    return axios.put( API_URL + endpoint, data,{ headers: authHeader() })
};

const remove = (endpoint, id) => {
    return axios.delete(API_URL + endpoint + `/${id}`, { headers: authHeader() });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("activeUser"));
};

const getToken = () => {
    let data = JSON.parse(localStorage.getItem("activeUser"));
    return data ? data.token : null;
};

const getUserDetail = () => {
    let data = JSON.parse(localStorage.getItem("userData"));
    return data ? data : null;
};

const checkPermission = (slug) => {
    
    let data = JSON.parse(localStorage.getItem("userData"));


    if (typeof data.role.permissions === "undefined" || typeof data.role.permissions ==="") {
        return false
        
    }
   
    let p = data.role.permissions.filter(e => e.slug === slug).length;

    return p ? p : false;
};


// const checkPermission = (slug) => {
//     const data = JSON.parse(localStorage.getItem("userData"));

//     // Safely access role and permissions with null checks
//     if (!data || !data.role || !data.role.permissions || !Array.isArray(data.role.permissions.slug)) {
//         return false; // Return false if any of the properties are missing
//     }

//     // Check if the slug exists in the permissions array
//     return data.role.permissions.slug.includes(slug);

// };



const logout = () => {
    return localStorage.removeItem("activeUser");
};
export default {
    install: (app, options) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$services = () => {
            // retrieve a nested property in `options`
            return {
                get_data,
                get,
                post,
                update,
                remove,
                getToken,
                getCurrentUser,
                logout,
                common_get,
                common_post,
                common_update,
                common_remove,
                getUserDetail,
                checkPermission,
            };
        }
        app.provide('services', {
            get_data,
            get,
            post,
            update,
            remove,
            getToken,
            getCurrentUser,
            logout,
            common_get,
            common_post,
            common_update,
            common_remove,
            getUserDetail,
            checkPermission,
        });
    }
}
/*
export default {
    get,
    post,
    update,
    remove,
    getToken,
    getCurrentUser,
    logout,
};
*/