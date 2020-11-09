import axios from 'axios';
import { defaultHeader, hostUrl } from './common';

export const wishlistProduct = async (productId) => {
    return (await axios.post(hostUrl + '/wishlist/add', { productId }, defaultHeader())).data;
};

export const removeWishlistProduct = async (productId) => {
    return (await axios.post(hostUrl + '/wishlist/remove', { productId }, defaultHeader())).data;
};
