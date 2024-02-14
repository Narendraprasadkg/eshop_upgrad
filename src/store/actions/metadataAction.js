import { fetchAllProducts, fetchAllProductsByCategory } from "../../api/productAPIs";
import { fetchAllCategories } from "../../api/categoryAPIs";
import { SET_FILTER, SET_SORTING, INIT_CATALOG, CLEAR_ALL} from "../actions";
import { ALL, DUMMY_API, baseURL } from "../../common";
  
export const setFilter = (category = "",type = SET_FILTER) => async (dispatch) => {
	try {
		if(baseURL === DUMMY_API){
			let products = null;
			if([ALL, null, '',undefined].includes(category)){
				category = ALL;
				products = await fetchAllProducts();
			}else{
				products = await fetchAllProductsByCategory(category);
			}
			dispatch({ type, selectedCategory: category, products: products.data});
		}else{
			dispatch({ type, selectedCategory: category });
		}
	} catch (error) {
		dispatch({ type, selectedCategory: ALL, products: []});
	}
};

export const initCatalog = (accessToken) => async (dispatch) => {
	try {
		const [categories, products] = await Promise.all([
			fetchAllCategories(accessToken),
			fetchAllProducts(accessToken),
		]);
		dispatch({
			type: INIT_CATALOG,
			categories: categories.data,
			products: products.data,
		});
	} catch (error) {
		dispatch({
			type: INIT_CATALOG,
			categories: ["ALL"],
			products: [],
		});
	}
};

export const setSortBy = (sortBy) => ({
	type: SET_SORTING,
	sortBy: sortBy,
});

export const clearAllMetadata = () => ({
	type: CLEAR_ALL,
});
  