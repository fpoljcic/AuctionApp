import axios from 'axios';

const hostUrl = 'http://localhost:8080';

export const registerUser = async (user) => {
    return await axios.post(hostUrl + '/auth/register', user);
};

export const loginUser = async (user) => {
    return await axios.post(hostUrl + '/auth/login', user);
};

export const getCategories = async () => {
    return (await axios.get(hostUrl + '/categories')).data;
};

export const getRandomSubcategories = async () => {
    return (await axios.get(hostUrl + '/subcategories/random')).data;
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
