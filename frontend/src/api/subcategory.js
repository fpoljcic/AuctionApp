import axios from 'axios';
import { hostUrl } from './common';

export const getRandomSubcategories = async () => {
    return (await axios.get(hostUrl + '/subcategories/random')).data;
};
