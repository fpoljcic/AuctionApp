import axios from 'axios';
import { cloudName, uploadPreset } from './common';

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);

    return (await axios.post('https://api.Cloudinary.com/v1_1/' + cloudName + '/image/upload', formData)).data.secure_url;
}
