import axios from 'axios';
import { hostUrl } from './common';

export const getProduct = async (productId, userId) => {
    return (await axios.get(`${hostUrl}/products/?product_id=${productId}&user_id=${userId}`)).data;
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
    return (await axios.get(hostUrl + '/products/related/?id=' + id)).data;
};

export const searchProducts = async (query, page) => {
    return (await axios.get(hostUrl + '/products/search/?query=' + query + '&page=' + page)).data;
};
