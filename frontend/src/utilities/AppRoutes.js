export const homeRoute = (history) => {
    history.push("/");
}

export const myAccountRoute = (history) => {
    history.push("/my_account");
}

export const categoryRoute = (history, category) => {
    history.push(`/shop/${category.name.split(' ').join('_').toLowerCase()}`);
}

export const allCategoryRoute = (history) => {
    history.push("/all");
}

export const subcategoryRoute = (history, subcategory) => {
    history.push(`/shop/${subcategory.categoryName.split(' ').join('_').toLowerCase()}/${subcategory.name.split(' ').join('_').toLowerCase()}`);
}

export const productRoute = (history, product) => {
    history.push(`/shop/${product.categoryName.split(' ').join('_').toLowerCase()}/${product.subcategoryName.split(' ').join('_').toLowerCase()}/${product.id}`);
}
