import axios from 'axios';
import { defaultHeader, hostUrl } from './common';

export const registerUser = async (user) => {
    return (await axios.post(hostUrl + '/auth/register', user)).data;
};

export const loginUser = async (user) => {
    return (await axios.post(hostUrl + '/auth/login', user)).data;
};

export const updateUser = async (user) => {
    return (await axios.put(hostUrl + '/auth/update', user, defaultHeader())).data;
};
