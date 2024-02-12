//Rest APIs for product
import { Axios, baseURL, DUMMY_API } from "../common/Axios";
import { apis } from "./APIs";
import { ID, SEARCH_BY_CATEGORY } from '../common';
import Product from "../common/Product"

/**
 * Used to get all avaliable products
 * @param {*} accessToken 
 * @returns 
 */
export const fetchAllProducts = (accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	Axios(apis.PRODUCTS).then((response) => {
		if(response.ok) {
			promiseResolveRef({
				data: response.data.products.map(p => new Product(p)),
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

/**
 * Used to fetch all productes asigned to particular category
 * @param {*} accessToken 
 * @param {*} category 
 * @returns 
 */
export const fetchAllProductsByCategory = (category,accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	Axios(apis.GET_PRODUCTS_BASED_ON_CATEGORY.replace(SEARCH_BY_CATEGORY,category)).then((response) => {
		if(response.ok) {
			promiseResolveRef({
				data: response.data.products.map(p => new Product(p)),
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

/**
 * Create a product
 * @param Product requestJson  
 * @param {*} accessToken 
 * @returns 
 */
export const createProduct = (requestJson, accessToken) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	Axios.post(apis.ADD_PRODUCT, requestJson)
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

/**
 * Delete product
 * @param {*} id 
 * @param {*} accessToken 
 * @returns 
 */
export const deleteProduct = (id, accessToken = null) => {
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	Axios.delete(apis.DELETE_PRODUCT.replace(ID,id))
	.then((response) => {
		if(response.ok) {
			promiseResolveRef({
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

export const modifyProduct = (requestJson, accessToken) => {
	
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});

	if(baseURL == DUMMY_API){
		let product = new Product();
		product.setCommonProps(requestJson);
		product.setPropsFromLocal(requestJson)
		requestJson = product;
	}
	Axios.put(apis.UPDATE_PRODUCT.replace(ID,requestJson.id), JSON.stringify(requestJson))
	.then((response) => {
		if(response.ok) {
			promiseResolveRef({
				message: "Product " + requestJson.name + " modified successfully.",
				response: response,
			});
		} else {
			let message = response.message;
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

export const viewProduct = (id, accessToken) => {
	
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	Axios(apis.PRODUCT.replace(ID,id)).then((response) => {
		if(response.ok) {
			promiseResolveRef({
				value: new Product(response.data),
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