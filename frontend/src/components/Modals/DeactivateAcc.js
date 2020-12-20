import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { useUserContext } from 'AppContext';
import { getUserType, removeSession } from 'utilities/localStorage';
import { homeUrl } from 'utilities/appUrls';
import { deactivate } from 'api/auth';

import './modal.css';

const DeactivateAcc = ({ showModal, setShowModal }) => {
    const { setLoggedIn } = useUserContext();
    const history = useHistory();
    const userType = getUserType();

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const deactivateAccount = async () => {
        if (password === "") {
            setError(true);
            return;
        }
        setLoading(true);
        try {
            await deactivate(password);
        } catch (e) {
            setLoading(false);
            setShowModal(false);
            return;
        }
        setLoading(false);
        setShowModal(false);
        history.push(homeUrl);
        setLoggedIn(false);
        removeSession();
    }

    return (
        <Modal size="lg" centered show={showModal} onHide={() => setShowModal(false)}>
            <div style={{ padding: 40 }}>
                {userType === null ?
                    "Please, enter your password below to confirm this action. " :
                    "Please, enter your associated email address below to confirm this action. "}
                After deactivating your account,
                <span style={{ fontWeight: 'bold' }}>
                    {' '}you won't be able to regain access to it anymore.
                </span>
                <Form.Group>
                    <Form.Control
                        className="form-control-gray"
                        size="xl-18"
                        type={userType === null ? "password" : "email"}
                        style={{ marginTop: 20 }}
                        value={password}
                        placeholder={userType === null ? "Password" : "Email address"}
                        maxLength={255}
                        onChange={e => {
                            setError(false);
                            setPassword(e.target.value);
                        }}
                        isInvalid={error}
                    />
                    <Form.Control.Feedback type="invalid">
                        *Enter your password
                    </Form.Control.Feedback>
                </Form.Group>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                    <Button
                        size="lg-2"
                        variant="transparent-black-shadow-disabled"
                        style={{ width: '48%' }}
                        onClick={() => setShowModal(false)}
                    >
                        CANCEL
                    </Button>
                    <Button
                        size="lg-2"
                        variant="danger"
                        style={{ width: '48%' }}
                        onClick={deactivateAccount}
                        disabled={loading}
                    >
                        CONFIRM
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default DeactivateAcc;
