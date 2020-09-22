import axios from 'axios';

export const registerUser = async (user) => {
    return await axios.post('http://localhost:8080/auth/register', user);
};

export const loginUser = async (user) => {
    return await axios.post('http://localhost:8080/auth/login', user);
};
