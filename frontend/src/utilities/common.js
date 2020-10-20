import { decode } from "jsonwebtoken";
import { getToken } from "utilities/localStorage";

export const validToken = () => {
    const token = getToken();
    if (token === null)
        return false;
    const exp = decode(token, { complete: true }).payload.exp;
    return Date.now() < exp * 1000;
}

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

export const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
