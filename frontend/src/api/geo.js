import axios from 'axios';

export const getGeoInfo = async () => {
    return (await axios.get('https://ipapi.co/json',)).data;
};
