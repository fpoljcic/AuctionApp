const tokenItem = 'auctionapp-token';
const userItem = 'auctionapp-user';
const emailItem = 'auctionapp-email';
const passwordItem = 'auctionapp-password';

// set token and user to local storage
export const setSession = (user, token) => {
    localStorage.setItem(tokenItem, token);
    localStorage.setItem(userItem, JSON.stringify(user));
}

// remove token and user from local storage
export const removeSession = () => {
    localStorage.removeItem(tokenItem);
    localStorage.removeItem(userItem);
};

// remember email & password info with local storage
export const setRememberInfo = (email, password) => {
    localStorage.setItem(emailItem, email);
    localStorage.setItem(passwordItem, password);
}

// get email & password info from local storage
export const getRememberInfo = () => {
    let email = localStorage.getItem(emailItem);
    let password = localStorage.getItem(passwordItem);
    return { email, password };
}

// remove email & password info from local storage
export const removeRememberInfo = () => {
    localStorage.removeItem(emailItem);
    localStorage.removeItem(passwordItem);
}

// return user from local storage
export const getUser = () => {
    const user = localStorage.getItem(userItem);
    return user ? JSON.parse(user) : null;
};

// return user id from local storage
export const getUserId = () => {
    const user = localStorage.getItem(userItem);
    return user ? JSON.parse(user).id : null;
};

// return token from local storage
export const getToken = () => {
    return localStorage.getItem(tokenItem) || null;
}
