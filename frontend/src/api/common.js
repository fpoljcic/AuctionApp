import { getToken } from 'utilities/localStorage';

export const hostUrl = process.env.REACT_APP_HOST_URL;
export const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
export const cloudName = process.env.REACT_APP_CLOUD_NAME;
export const ipApiKey = process.env.REACT_APP_IP_API_KEY;

export const defaultHeader = () => {
    return {
        headers: {
            'Authorization': 'Bearer ' + getToken()
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
