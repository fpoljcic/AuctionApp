import axios from 'axios';
import { getParams, ipApiKey } from './common';

export const getGeoInfo = async () => {
    return (await axios.get('http://api.ipstack.com/check', getParams({ access_key: ipApiKey }))).data;
};
