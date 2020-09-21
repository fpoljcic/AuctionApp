import axios from 'axios';

export const registerUser = async (user) => {
    return await axios.post('http://localhost:8080/person/register', user);
};

export const loginUser = async (user) => {
    return await axios.post('http://localhost:8080/person/login', user);
};