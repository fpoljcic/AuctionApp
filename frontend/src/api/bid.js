import axios from 'axios';
import { defaultHeader, hostUrl } from './common';

export const getBidsForProduct = async (id) => {
    return (await axios.get(hostUrl + '/bids/product/?id=' + id)).data;
};

export const bidForProduct = async (price, productId) => {
    return (await axios.post(hostUrl + '/bids/add', { price, productId }, defaultHeader())).data;
};
