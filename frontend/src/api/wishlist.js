import axios from 'axios';
import { defaultHeader, hostUrl } from './common';

export const wishlistProduct = async (personId, productId) => {
    return (await axios.post(hostUrl + '/wishlist/add', { personId, productId }, defaultHeader())).data;
};

export const removeWishlistProduct = async (personId, productId) => {
    return (await axios.post(hostUrl + '/wishlist/remove', { personId, productId }, defaultHeader())).data;
};
