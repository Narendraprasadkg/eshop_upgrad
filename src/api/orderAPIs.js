//Rest APIs for order

import { Axios, baseURL, DUMMY_API } from "../common/Axios";
import { AxiosJson } from "../common/jsonServerAxios";
import {apis} from "./APIs";

export const createOrder = (requestJson, accessToken) => {
	
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	const axios = baseURL === DUMMY_API ? AxiosJson : Axios;
	
	axios.post(apis.ORDERS, JSON.stringify(requestJson)).then((response) => {
		if(response.ok) {
			promiseResolveRef({
				response: response.data,
			});
		} else {
			promiseRejectRef({
				reason: "Some error occurred. Please try again.",
				response: response,
			});
		}
	}).catch((err) => {
		promiseRejectRef({
			reason: "Server error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};