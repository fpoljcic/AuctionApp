import axios from 'axios';
import { defaultHeader, getParams, hostUrl } from './common';

export const getBidsForProduct = async (id) => {
    return (await axios.get(hostUrl + '/bids/product', getParams({ id }))).data;
};

export const bidForProduct = async (price, productId) => {
    return (await axios.post(hostUrl + '/bids/add', { price, productId }, defaultHeader())).data;
};

export const removeBid = async (bidId, productId) => {
    return (await axios.post(hostUrl + '/bids/remove', { bidId, productId }, defaultHeader())).data;
};
