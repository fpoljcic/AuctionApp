import axios from 'axios';

export const registerUser = async (user) => {
    return await axios.post('http://localhost:8080/person/register', user);
};