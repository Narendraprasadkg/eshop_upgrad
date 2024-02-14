import axios from 'axios';
import { baseURL, LOCAL, DUMMY_API } from '../common';

let Axios = createAxiosInstance(null);

function createAxiosInstance() {
    const Axios = axios.create({
        baseURL,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json', // Add any other headers you may need
        }
    });

    Axios.interceptors.response.use(
        (response) => {
            const contentType = response.headers['content-type'];
            if (baseURL === LOCAL && contentType && contentType.includes('application/json')) {
                if (typeof(response) === 'string') {
                    response.data = JSON.parse(response.data);
                }
            }
    
            if ([DUMMY_API, LOCAL].includes(baseURL)) {
                response.ok = [200,201].includes(response.status);
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

    return Axios;
}



function setAxios() {
    Axios = createAxiosInstance();
}

export { Axios, baseURL, LOCAL, DUMMY_API, setAxios };
