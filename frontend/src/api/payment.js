import axios from 'axios';
import { defaultHeader, getParams, hostUrl } from './common';

export const getReceipt = async (productId) => {
    const headers = { ...defaultHeader(), ...getParams({ productId }) };
    return (await axios.get(hostUrl + '/payments/receipt', headers)).data;
};
