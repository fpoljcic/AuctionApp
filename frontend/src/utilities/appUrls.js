export const homeUrl = "/";

export const loginUrl = "/login";
export const registerUrl = "/register";
export const myAccountUrl = "/my_account";
export const myAccountSellerUrl = "/my_account/seller";
export const myAccountSellerSellUrl = "/my_account/seller/sell";
export const myAccountBidsUrl = "/my_account/bids";
export const myAccountWishlistUrl = "/my_account/wishlist";
export const myAccountSettingsUrl = "/my_account/settings";
export const forgotPasswordUrl = "/forgot_password";

export const allCategoryUrl = "/all";

export const shopUrl = "/shop";
export const aboutUrl = "/about";
export const termsUrl = "/terms";
export const privacyUrl = "/privacy";


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
