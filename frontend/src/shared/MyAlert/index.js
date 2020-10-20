import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAlertContext } from 'AppContext';

import './myAlert.css';

const MyAlert = () => {
    const { alertVisible, variant, message, setAlertVisible } = useAlertContext();

    return (
        <Alert dismissible onClose={() => setAlertVisible(false)} transition={false} show={alertVisible} variant={variant}>
            {message}
        </Alert>
    );
}

export default MyAlert;
