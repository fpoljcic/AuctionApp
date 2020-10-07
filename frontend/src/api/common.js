import { getToken } from 'utilities/localStorage';

export const hostUrl = process.env.REACT_APP_HOST_URL;

export const defaultHeader = () => {
    return {
        headers: {
            'Authorization': 'Bearer ' + getToken()
        }
    };
}
