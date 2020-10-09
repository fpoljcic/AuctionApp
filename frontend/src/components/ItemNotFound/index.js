import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './itemNotFound.css';

const ItemNotFound = () => {

    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <div className="item-not-found-container font-18">
            <div>
                No items found
            </div>
            <Button onClick={goBack} style={{ width: 180 }} size="xxl" variant="transparent-black-shadow">
                GO BACK
            </Button>
        </div>
    );
}

export default ItemNotFound;
