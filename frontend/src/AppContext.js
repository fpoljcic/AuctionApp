import React, { createContext, useContext, useState } from "react";
import { scrollToTop, validToken } from "utilities/common";
import axios from "axios";

export const UserContext = createContext({});
export const AlertContext = createContext({});
export const BreadcrumbContext = createContext({});

export const useUserContext = () => useContext(UserContext);
export const useAlertContext = () => useContext(AlertContext);
export const useBreadcrumbContext = () => useContext(BreadcrumbContext);

export const AppProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(validToken());

    const [breadcrumbTitle, setBreadcrumbTitle] = useState(null);
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);

    const [alertVisible, setAlertVisible] = useState(false);
    const [variant, setVariant] = useState(null);
    const [message, setMessage] = useState(null);

    const handleError = (error) => {
        let errorMessage = error.message;
        if (error.response !== undefined) {
            if (error.response.data.message !== undefined)
                errorMessage = error.response.data.message;
            else
                errorMessage = error.response.data.error.message;
        }
        showMessage("warning", errorMessage);
        return Promise.reject(error);
    }

    axios.interceptors.response.use((response) => response, handleError);

    const showMessage = (variant, message) => {
        scrollToTop(true);
        setVariant(variant);
        setMessage(message);
        setAlertVisible(true);
    }

    const setBreadcrumb = (title, items) => {
        setBreadcrumbTitle(title);
        setBreadcrumbItems(items);
        setAlertVisible(false);
    }

    const removeBreadcrumb = () => {
        setBreadcrumbTitle(null);
        setAlertVisible(false);
    }

    return (
        <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
            <BreadcrumbContext.Provider value={{ breadcrumbTitle, breadcrumbItems, setBreadcrumb, removeBreadcrumb }}>
                <AlertContext.Provider value={{ alertVisible, variant, message, showMessage, setAlertVisible }}>
                    {children}
                </AlertContext.Provider>
            </BreadcrumbContext.Provider>
        </UserContext.Provider>
    );
};
