import axios from 'axios';
import { getParams, hostUrl } from './common';

export const getRandomSubcategories = async () => {
    return (await axios.get(hostUrl + '/subcategories/random')).data;
};

export const getSubcategoriesForCategory = async (id) => {
    return (await axios.get(hostUrl + '/subcategories/category', getParams({ id }))).data;
}
