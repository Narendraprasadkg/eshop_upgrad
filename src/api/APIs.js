// APIs.js

import { baseURL } from "../common/Axios";
import { ID, SEARCH_BY_CATEGORY, SEARCH_TEXT } from '../common';

const apis = baseURL === "https://dummyjson.com/" ? {
    LOGIN: "auth/login",
    SIGNUP: "auth/signup",
    PRODUCTS : '/products',
    PRODUCT : `/products/${ID}`,
    SEARCH_FOR_PRODUCTS : `/products/search?q=${SEARCH_TEXT}`,
    CATEGORIES : '/products/categories',
    GET_PRODUCTS_BASED_ON_CATEGORY : `/products/category/${SEARCH_BY_CATEGORY}`,
    ADD_PRODUCT : '/products/add',
    UPDATE_PRODUCT : `/products/${ID}`, 
    DELETE_PRODUCT : `/products/${ID}`,
    ORDERS:'/orders',
    ADDRESSES : '/addresses',
    ADD_ADDRESS : '/addresses'
} : {
    LOGIN: "auth/signin",
    SIGNUP: "auth/signup",
    PRODUCTS : '/products',
    PRODUCT : `/products/${ID}`,
    SEARCH_FOR_PRODUCTS : `/products/search?q=${SEARCH_TEXT}`,
    CATEGORIES : '/products/categories',
    GET_PRODUCTS_BASED_ON_CATEGORY : `/products/category/${SEARCH_BY_CATEGORY}`,
    ADD_PRODUCT : '/products',
    UPDATE_PRODUCT : `/products/${ID}`, 
    DELETE_PRODUCT : `/products/${ID}`,
    ORDERS:'/orders',
    ADDRESSES : '/addresses',
    ADD_ADDRESS : '/addresses'
};

export { apis };
