import axios from 'axios';

const hostUrl = 'http://localhost:8080';

export const registerUser = async (user) => {
    return await axios.post(hostUrl + '/auth/register', user);
};

export const loginUser = async (user) => {
    return await axios.post(hostUrl + '/auth/login', user);
};
