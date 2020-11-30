import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ProductTable from 'components/Tables/ProductTable';
import { getUserBidProducts } from 'api/product';
import { useAlertContext } from 'AppContext';

import './myAccountTabs.css';

const Bids = () => {
    const history = useHistory();
    const { showMessage } = useAlertContext();

    const productName = history.location.state != null && history.location.state.productName ? history.location.state.productName : false;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productName) {
            showMessage("success", "You have successfully made a payment for '" + productName + "'");
        }

        const fetchData = async () => {
            try {
                setProducts(await getUserBidProducts());
            } catch (e) { }
            setLoading(false);
        }

        fetchData();

        // eslint-disable-next-line
    }, [])

    return (
        <>
            <ProductTable type="bids" products={products} />
            {loading || products.length === 0 ?
                <div className="no-table-items font-18">
                    {loading ? <Spinner className="table-spinner" animation="border" /> : "No bids found"}
                </div> : null}
        </>
    );
}

export default Bids;
