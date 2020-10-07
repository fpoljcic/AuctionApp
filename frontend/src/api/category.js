import axios from 'axios';
import { hostUrl } from './common';

export const getCategories = async () => {
    return (await axios.get(hostUrl + '/categories')).data;
};
