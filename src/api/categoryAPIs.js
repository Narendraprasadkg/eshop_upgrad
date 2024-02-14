//Rest APIs for category

import { Axios } from "../common/Axios";
import { apis } from "./APIs";

export const fetchAllCategories = (accessToken) => {
	
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	Axios(apis.CATEGORIES)
	.then((response) => {
		if(response.ok) {
			let arr = response.data.filter(f => f.trim().toLowerCase() !== "all");
			arr.sort();
			promiseResolveRef({
				data: arr,
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