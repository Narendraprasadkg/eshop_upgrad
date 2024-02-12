import { SET_FILTER, CLEAR_FILTER, SET_SORTING, INIT_CATALOG, CLEAR_ALL } from "../actions";

let initialState = {
  selectedCategory: null,
  categories: [],
  products: [],
  selectedSortBy: "DEFAULT",
};

const actionReducer = (state = initialState, action) => {
  let data;
  switch (action.type) {
    case SET_FILTER: {
      data = {
        ...state,
        selectedCategory: action.selectedCategory,
		    products:action.products
      };
      break;
    }
    case CLEAR_FILTER: {
      data = {
        ...state,
        selectedCategory: null,
        products:action.products
      };
      break;
    }
    case SET_SORTING: {
      data = {
        ...state,
        selectedSortBy: action.sortBy,
      };
      break;
    }
    case INIT_CATALOG: {
      data = {
        ...state,
        categories: action.categories,
        products: action.products,
      };
      break;
    }
    case CLEAR_ALL: {
      data = initialState;
      break;
    }
    default: {
      data = state;
    }
  }
  localStorage.setItem("eshop_project", JSON.stringify(data));
  return data;
};

export default actionReducer;
