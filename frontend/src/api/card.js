import axios from 'axios';
import { defaultHeader, hostUrl } from './common';

export const getCard = async () => {
    return (await axios.get(hostUrl + '/cards/person', defaultHeader())).data;
};
