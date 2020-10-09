import axios from 'axios';
import { getUserId } from 'utilities/localStorage';
import { defaultHeader, getParams, hostUrl } from './common';

export const getProduct = async (product_id, user_id) => {
    return (await axios.get(hostUrl + '/products', getParams({ product_id, user_id }))).data;
};

export const getFeaturedRandomProducts = async () => {
    return (await axios.get(hostUrl + '/products/featured/random')).data;
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

export const searchProducts = async (query, category, subcategory, page, sort) => {
    let headers;
    if (getUserId() === null)
        headers = getParams({ query, category, subcategory, page, sort });
    else
        headers = { ...defaultHeader(), ...getParams({ query, category, subcategory, page, sort }) };
    return (await axios.get(hostUrl + '/products/search', headers)).data;
};

export const searchCountProducts = async (query) => {
    return (await axios.get(hostUrl + '/products/search/count', getParams({ query }))).data;
};
