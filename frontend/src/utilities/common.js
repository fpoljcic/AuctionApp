import { decode } from "jsonwebtoken";
import { getToken } from "utilities/localStorage";
import countriesJSON from "assets/json/countries.min.json";
import countryCodesJSON from "assets/json/country-codes.min.json";
import parsePhoneNumberFromString from "libphonenumber-js";

export const countries = Object.keys(countriesJSON);

export const citiesByCountry = (country) => {
    if (country == null)
        return [];
    const result = countriesJSON[country];
    return result !== undefined ? result : [];
}

export const callCodeForCountry = (country) => {
    if (country == null)
        return "";
    const result = countryCodesJSON.countryCodes.filter(el => el.country_name === country);
    return result.length === 1 ? result[0].dialling_code : "";
}

export const codeForCountry = (country) => {
    if (country == null)
        return "";
    const result = countryCodesJSON.countryCodes.filter(el => el.country_name === country);
    return result.length === 1 ? result[0].country_code : "";
}

export const validPhoneNumber = (phone, country, isCountryCode) => {
    if (phone === undefined)
        return false;
    const parsedPhoneNumber = parsePhoneNumberFromString(phone, isCountryCode ? country : codeForCountry(country));
    if (parsedPhoneNumber === undefined)
        return false;
    return parsedPhoneNumber.isValid();
}

export const validToken = () => {
    const token = getToken();
    if (token === null)
        return false;
    const exp = decode(token, { complete: true }).payload.exp;
    return Date.now() < exp * 1000;
}

export const scrollToTop = (smooth) => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

export const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const isTouchDevice = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

export const placeholderImage = "https://i.imgur.com/O0O16un.gif";

export const soundUrl = "https://ia800203.us.archive.org/14/items/slack_sfx/confirm_delivery.mp3";
