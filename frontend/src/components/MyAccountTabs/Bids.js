import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import ProductTable from 'components/Tables/ProductTable';
import { getUserBidProducts } from 'api/product';

import './myAccountTabs.css';

const Bids = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProducts(await getUserBidProducts());
            } catch (e) { }
            setLoading(false);
        }

        fetchData();
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
