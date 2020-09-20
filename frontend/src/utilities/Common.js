// set token and user to local storage
export const setUser = (token, user) => {
    localStorage.setItem('auctionapp-token', token);
    localStorage.setItem('auctionapp-user', JSON.stringify(user));
}

// return user from the local storage
export const getUser = () => {
    return localStorage.getItem('auctionapp-user') || null;
}

// return token from local storage
export const getToken = () => {
    return localStorage.getItem('auctionapp-token') || null;
}