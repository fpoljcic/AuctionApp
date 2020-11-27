import axios from 'axios';
import { getUserId } from 'utilities/localStorage';
import { defaultHeader, getParams, hostUrl } from './common';

export const getProduct = async (productId, userId) => {
    return (await axios.get(hostUrl + '/products', getParams({ productId, userId }))).data;
};

export const getFeaturedProducts = async () => {
    return (await axios.get(hostUrl + '/products/featured', defaultHeader())).data;
};

export const getNewProducts = async () => {
    return (await axios.get(hostUrl + '/products/new')).data;
};

export const getLastProducts = async () => {
    return (await axios.get(hostUrl + '/products/last')).data;
};

export const getRelatedProducts = async (id) => {
    return (await axios.get(hostUrl + '/products/related', getParams({ id }))).data;
};

export const searchProducts = async (query, category, subcategory, minPrice, maxPrice, color, size, page, sort) => {
    let headers;
    if (getUserId() === null)
        headers = getParams({ query, category, subcategory, minPrice, maxPrice, color, size, page, sort });
    else
        headers = { ...defaultHeader(), ...getParams({ query, category, subcategory, minPrice, maxPrice, color, size, page, sort }) };
    return (await axios.get(hostUrl + '/products/search', headers)).data;
};

export const searchCountProducts = async (query, minPrice, maxPrice, color, size) => {
    return (await axios.get(hostUrl + '/products/search/count', getParams({ query, minPrice, maxPrice, color, size }))).data;
};

export const filterCountProducts = async (query, category, subcategory, minPrice, maxPrice, color, size) => {
    return (await axios.get(hostUrl + '/products/filter/count', getParams({ query, category, subcategory, minPrice, maxPrice, color, size }))).data;
};

export const getProductFilters = async () => {
    return (await axios.get(hostUrl + '/products/filters')).data;
};

export const addProduct = async (product) => {
    return (await axios.post(hostUrl + '/products/add', { ...product }, defaultHeader())).data;
};

export const getUserProducts = async () => {
    return (await axios.get(hostUrl + '/products/user', defaultHeader())).data;
};

export const getUserBidProducts = async () => {
    return (await axios.get(hostUrl + '/products/user/bid', defaultHeader())).data;
};

export const getUserWishlistProducts = async () => {
    return (await axios.get(hostUrl + '/products/user/wishlist', defaultHeader())).data;
};
