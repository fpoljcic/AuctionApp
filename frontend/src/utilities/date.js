import moment, { months } from "moment";

export const getMonths = () => {
    return months();
}

export const getNextYears = (n) => {
    const year = moment().year();
    return [...Array(n).keys()].map(x => year + x);
}

export const getPastYears = (n) => {
    const year = moment().year();
    return [...Array(n).keys()].map(x => year - x);
}

export const getDaysArrayInMonth = (month, year) => {
    if (month == null || year == null)
        return [];
    const monthM = month > 0 ? month : moment().month() + 1;
    const yearM = year > 0 ? year : moment().year();
    return Array.from({ length: moment(yearM + "-" + monthM, "YYYY-MM").daysInMonth() }, (_, i) => i + 1);
}

export const getDaysInMonth = (month, year) => {
    if (month == null || year == null)
        return 0;
    return moment(year + "-" + month, "YYYY-MM").daysInMonth();
}
