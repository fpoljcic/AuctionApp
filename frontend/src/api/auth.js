import axios from 'axios';
import { defaultHeader, getParams, hostUrl } from './common';

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

export const validResetToken = async (token) => {
    return (await axios.post(hostUrl + '/auth/valid_token', { token })).data;
};

export const getUserInfo = async (userId) => {
    const headers = { ...defaultHeader(), ...getParams({ userId }) };
    return (await axios.get(hostUrl + '/auth', headers)).data;
};

export const updateNotifications = async (emailNotify, pushNotify) => {
    return (await axios.post(hostUrl + '/auth/notifications/update', { emailNotify, pushNotify }, defaultHeader())).data;
};
