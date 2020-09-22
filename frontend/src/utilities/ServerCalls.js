import axios from 'axios';

export const registerUser = async (user) => {
    return await axios.post('http://localhost:8080/auth/register', user);
};

export const loginUser = async (user) => {
    return await axios.post('http://localhost:8080/auth/login', user);
};

export const getCategories = async () => {
    return (await axios.get('http://localhost:8080/categories')).data;
};

export const getFeaturedRandomProducts = async () => {
    return (await axios.get('http://localhost:8080/products/featured/random')).data;
};
