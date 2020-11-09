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

export const forgotPassword = async (email) => {
    return (await axios.post(hostUrl + '/auth/forgot_password', { email })).data;
};

export const resetPassword = async (token, password) => {
    return (await axios.post(hostUrl + '/auth/reset_password', { token, password })).data;
};
