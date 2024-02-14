import { jwtDecode } from "jwt-decode";
import { Axios } from "../common/Axios";
import {apis} from "./APIs";
import { DUMMY_API,baseURL } from '../common';

export const doLogin = (email, password) => {
  	return new Promise((resolve, reject) => {
		Axios.post(apis.LOGIN, {username: email,password: password})
		.then((response) => {
			if (response.ok) {
				let token = response.data.token;
				let decoded = jwtDecode(token);
				resolve({
					username: response.data.email,
					accessToken: token,
					accessTokenTimeout: decoded.exp * 1000,
					roles: baseURL === DUMMY_API ? ["ADMIN"] : response.data.roles,
					userId: response.data.id,
					response: response,
				});
			} else {
				reject({
					reason: "Server error occurred. Please try again.",
					response: response,
				});
			}
		})
		.catch((err) => {
			reject({
			reason: "Some error occurred. Please try again.",
			response: err,
			});
		});
	});
};

export const doSignup = (signupData) => {
  return new Promise((resolve, reject) => {
    Axios.post(apis.SIGNUP, signupData)
      .then((response) => {
        if (response.ok) {
          resolve({
            message: response.data.message,
            response: response,
          });
        } else {
          let message = response.data.message || "Server error occurred. Please try again.";
          reject({
            reason: message,
            response: response,
          });
        }
      })
      .catch((err) => {
        reject({
          reason: "Some error occurred. Please try again.",
          response: err,
        });
      });
  });
};
