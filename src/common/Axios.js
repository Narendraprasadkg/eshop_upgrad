import axios from 'axios';
import { baseURL, LOCAL, DUMMY_API } from '../common';

const Axios = axios.create({
    baseURL 
});

Axios.interceptors.response.use(
    (response) => {
        const contentType = response.headers['content-type'];
        if (baseURL === LOCAL && contentType && contentType.includes('application/json')) {
            response.data = JSON.parse(response.data);
        }

        if(baseURL === DUMMY_API){
            response.ok = response.status === 200;
        }

        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made, but the server responded with an error
            console.error("Response Error:", error.response.status, error.response.data);
        } else if (error.request) {
            // The request was made, but no response was received
            console.error("No Response Error:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Request Setup Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export { Axios, baseURL, LOCAL, DUMMY_API};
