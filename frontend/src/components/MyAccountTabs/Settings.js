import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import DeactivateAcc from 'components/Modals/DeactivateAcc';
import { getUser, setUser } from 'utilities/localStorage';
import { updateNotifications } from 'api/auth';

import './myAccountTabs.css';

const Settings = () => {

    const user = getUser();

    const [emailLoading, setEmailLoading] = useState(false);
    const [pushLoading, setPushLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [emailChecked, setEmailChecked] = useState(user.emailNotify);
    const [pushChecked, setPushChecked] = useState(user.pushNotify);

    const handleEmailClick = async (emailNotify) => {
        setEmailLoading(true);
        try {
            await updateNotifications(emailNotify, user.pushNotify);
            user.emailNotify = emailNotify;
        } catch (e) {
            setEmailChecked(user.emailNotify);
            setEmailLoading(false);
            return;
        }
        setUser(user);
        setEmailChecked(user.emailNotify);
        setEmailLoading(false);
    }

    const handlePushClick = async (pushNotify) => {
        setPushLoading(true);
        try {
            await updateNotifications(user.emailNotify, pushNotify);
            user.pushNotify = pushNotify;
        } catch (e) {
            setPushChecked(user.pushNotify);
            setPushLoading(false);
            return;
        }
        setUser(user);
        setPushChecked(user.pushNotify);
        setPushLoading(false);
    }

    return (
        <div className="settings-container">
            <div className="settings-tab">
                <div className="settings-tab-title">
                    Policy and Community
                </div>
                <div className="settings-tab-content">
                    Receive updates on bids and seller's offers. Stay informed through:
                    <Form.Check
                        custom
                        type="checkbox"
                        id="custom-email-checkbox"
                        label="Email"
                        style={{ marginTop: 22 }}
                        checked={emailChecked}
                        disabled={emailLoading}
                        onChange={e => handleEmailClick(e.target.checked)}
                    />
                    <Form.Check
                        custom
                        type="checkbox"
                        id="custom-push-checkbox"
                        label="Push Notifications"
                        style={{ marginTop: 22 }}
                        checked={pushChecked}
                        disabled={pushLoading}
                        onChange={e => handlePushClick(e.target.checked)}
                    />
                </div>
            </div>

            <div className="settings-tab">
                <div className="settings-tab-title">
                    Contact Information
                </div>
                <div className="settings-tab-content">
                    This information can be edited on your profile.
                    <div style={{ marginTop: 30 }}>
                        Email:
                        <span style={{ marginLeft: 23, wordWrap: 'anywhere' }}>
                            <a className="purple-nav-link" target="_blank" rel="noopener noreferrer" href={"mailto:" + user.email}>{user.email}</a>
                        </span>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        Phone:
                        <span style={{ marginLeft: 16, wordWrap: 'anywhere' }}>
                            {user.phone !== undefined ?
                                <a className="purple-nav-link" href={"tel:" + user.phone}>{user.phone}</a> : "/"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="settings-tab">
                <div className="settings-tab-title">
                    Account
                </div>
                <div className="settings-tab-content">
                    Do you want to deactivate your account?
                    <Button
                        size="xxl"
                        style={{ width: 243, marginTop: 38 }}
                        variant="transparent-black-shadow-disabled"
                        onClick={() => setShowModal(true)}
                    >
                        DEACTIVATE
                    </Button>
                    <DeactivateAcc showModal={showModal} setShowModal={setShowModal} />
                </div>
            </div>
        </div>
    );
}

export default Settings;
