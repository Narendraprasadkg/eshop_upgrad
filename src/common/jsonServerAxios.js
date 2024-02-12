import axios from 'axios';

const AxiosJson = axios.create({
    baseURL : "http://localhost:3001/" // Set your desired base URL here
    // You can add more configuration options if needed
});

AxiosJson.interceptors.request.use(
    (config) => {
        if(config.data){
            config.headers['Content-Type'] = 'application/json';
            config.data = JSON.parse(config.data);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosJson.interceptors.response.use(
    (response) => {
        console.log("respone")
        // const contentType = response.headers['content-type'];
        if ([201,200].includes(response.status)) {
            response.ok = true;
        }
        return response;
    },
    (error) => {
        // Detailed error handling
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

export { AxiosJson };
