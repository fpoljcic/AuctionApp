import { getUserInfo } from 'api/auth';
import React, { useEffect, useState } from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import { GoStar } from 'react-icons/go';
import Rate from 'rc-rate';

import './modal.css';

const RateUser = ({ onDone, showModal, personAddedId }) => {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setUser(await getUserInfo(personAddedId));
            } catch (e) { }
        }

        fetchData();
    }, [personAddedId])

    const handleClick = (rating) => {
        setLoading(true);
        onDone(rating);
    }

    return (
        <Modal backdrop="static" size="lg" centered show={showModal}>
            <div className="tab-title">
                SELLER RATING
            </div>
            <div className="tab-content rate-content">
                <Image style={{ marginBottom: 5 }} className="avatar-image-small" src={user.photo} roundedCircle />
                {user.name}
                <div style={{ fontWeight: 'bold', marginTop: 40 }}>
                    Please, rate a seller!
                </div>
                <Rate character={<GoStar />} style={{ fontSize: 28 }} value={rating} onChange={value => setRating(value)} />
                <div style={{ marginTop: 40, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        size="xxl"
                        className="sell-submit-button"
                        variant="transparent-black-shadow-disabled"
                        disabled={loading}
                        onClick={() => handleClick(0)}
                    >
                        SKIP
                    </Button>
                    <Button
                        size="xxl"
                        className="sell-submit-button"
                        variant="fill-purple-shadow"
                        disabled={loading}
                        onClick={() => handleClick(rating)}
                    >
                        DONE
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default RateUser;
