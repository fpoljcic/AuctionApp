import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

import './modal.css';

const Confirm = ({ showModal, setShowModal, message, onConfirm }) => {

    const [loading, setLoading] = useState(false);

    const confirmClick = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
        setShowModal(false);
    }

    return (
        <Modal size="lg" centered show={showModal} onHide={() => setShowModal(false)}>
            <div style={{ padding: 40 }}>
                {message}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                    <Button
                        size="lg-2"
                        variant="transparent-black-shadow-disabled"
                        style={{ width: '48%' }}
                        onClick={() => setShowModal(false)}
                        disabled={loading}
                    >
                        CANCEL
                    </Button>
                    <Button
                        size="lg-2"
                        variant="danger"
                        style={{ width: '48%' }}
                        onClick={confirmClick}
                        disabled={loading}
                    >
                        CONFIRM
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default Confirm;
