import axios from 'axios';
import { getParams, hostUrl, defaultHeader } from './common';

export const getFeaturedSubcategories = async () => {
    return (await axios.get(hostUrl + '/subcategories/featured', defaultHeader())).data;
};

export const getSubcategoriesForCategory = async (id) => {
    return (await axios.get(hostUrl + '/subcategories/category', getParams({ id }))).data;
};

export const getSubcategories = async () => {
    return (await axios.get(hostUrl + '/subcategories')).data;
};
