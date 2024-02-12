import { baseURL, DUMMY_API, LOCAL } from "./Axios";

class Product {
    id = "";
    title = "";
    name = "";
    category = ""; // Adjust based on your actual requirements
    price = "";
    thumbnail = "";
    imageUrl = "";
    stock = "";
    description = "";
    availableItems = "";
    manufacturer = "";
    brand = "";

    constructor(product = null) {
        if (product) {
            this.setCommonProps(product);
            if (baseURL === DUMMY_API) {
                this.setPropsFromDummy(product);
            } else if (baseURL === LOCAL) {
                this.setPropsFromLocal(product);
            }

            // Adjust category assignment based on your actual requirements
        }
    }

    setPropsFromLocal(product) {
        [this.title, this.name] = [product.name, product.name];
        [this.thumbnail, this.imageUrl] = [product.imageUrl, product.imageUrl];
        [this.stock, this.availableItems] = [product.availableItems, product.availableItems];
        [this.manufacturer, this.brand] = [product.manufacturer, product.manufacturer];
    }

    setPropsFromDummy(product) {
        [this.name, this.title] = [product.title, product.title];
        [this.thumbnail, this.imageUrl] = [product.thumbnail, product.thumbnail];
        [this.stock, this.availableItems] = [product.stock, product.stock];
        [this.manufacturer, this.brand] = [product.brand, product.brand];
    }
    
    setCommonProps(product){
        this.id = product.id;
        this.price = product.price;
        this.category = product.category;
        this.description = product.description;
    }
}

export default Product;
