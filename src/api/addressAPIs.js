//Rest APIs for address
import { Axios, baseURL, DUMMY_API } from "../common/Axios";
import { AxiosJson } from "../common/jsonServerAxios";

import {apis} from "./APIs";

export const fetchAllAddresses = (accessToken) => {
	
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	const axios = baseURL === DUMMY_API ? AxiosJson : Axios;

	axios(apis.ADDRESSES).then((response) => {
		if(response.ok) {
			promiseResolveRef({
				data: response.data,
				response: response,
			});
		} else {
			promiseRejectRef({
				reason: "Server error occurred.",
				response: response,
			});
		}
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred.",
			response: err,
		});
	});
	return promise;
};

export const createAddress = (requestJson, accessToken) => {
	
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	const axios = baseURL === DUMMY_API ? AxiosJson : Axios;
	axios(apis.ADD_ADDRESS, JSON.stringify(requestJson))
	.then((response) => {
		if(response.ok) {
			promiseResolveRef({
				message: "Product " + requestJson.name + " added successfully.",
				response: response,
			});
		} else {
			let message = response.data.message;
			if(message === undefined || message === null) {
				message = "Server error occurred. Please try again.";
			}
			promiseRejectRef({
				reason: message,
				response: response,
			});
		}
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred. Please try again.",
			response: err,
		});
	});
	return promise;
};