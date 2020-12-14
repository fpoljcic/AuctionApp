import axios from 'axios';
import { defaultHeader, getParams, hostUrl } from './common';

export const getNotifications = async (page, size) => {
    const headers = { ...defaultHeader(), ...getParams({ page, size }) };
    return (await axios.get(hostUrl + '/notifications', headers)).data;
};

export const checkNotifications = async (uncheckedIds) => {
    const ids = uncheckedIds.join(",");
    const headers = { ...defaultHeader(), ...getParams({ ids }) };
    return (await axios.get(hostUrl + '/notifications/check', headers)).data;
};
