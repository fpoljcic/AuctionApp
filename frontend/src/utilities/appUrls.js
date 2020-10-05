export const homeUrl = "/";

export const loginUrl = "/login";
export const registerUrl = "/register";
export const myAccountUrl = "/my_account";
export const forgotPasswordUrl = "/forgot_password";

export const allCategoryUrl = "/all";

export const shopUrl = "/shop";
export const aboutUrl = "/shop/about";
export const termsUrl = "/shop/terms";
export const privacyUrl = "/shop/privacy";


export const productUrl = (product) => {
    return `/shop/${product.categoryName.split(' ').join('_').toLowerCase()}/${product.subcategoryName.split(' ').join('_').toLowerCase()}/${product.id}`;
}

export const categoryUrl = (category) => {
    return `/shop/${category.name.split(' ').join('_').toLowerCase()}`;
}

export const subcategoryUrl = (subcategory) => {
    return `/shop/${subcategory.categoryName.split(' ').join('_').toLowerCase()}/${subcategory.name.split(' ').join('_').toLowerCase()}`;
}
