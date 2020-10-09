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
    return `/shop/${removeSpaces(product.categoryName)}/${removeSpaces(product.subcategoryName)}/${product.id}`;
}

export const categoryUrl = (category) => {
    return `/shop/${removeSpaces(category.name)}`;
}

export const subcategoryUrl = (subcategory) => {
    return `/shop/${removeSpaces(subcategory.categoryName)}/${removeSpaces(subcategory.name)}`;
}

export const removeSpaces = (name) => name.split(' ').join('_').toLowerCase();
