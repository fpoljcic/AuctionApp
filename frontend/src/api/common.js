import { getToken } from 'utilities/localStorage';

export const hostUrl = process.env.REACT_APP_HOST_URL;
export const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
export const cloudName = process.env.REACT_APP_CLOUD_NAME;

export const defaultHeader = () => {
    const token = getToken();
    if (token === null)
        return null;
    return {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
}

export const getParams = (args) => {
    return {
        params: {
            ...args
        }
    };
}
