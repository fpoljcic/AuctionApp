import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import WishlistTable from 'components/Tables/WishlistTable';
import { getUserWishlistProducts } from 'api/product';

import './myAccountTabs.css';

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProducts(await getUserWishlistProducts());
            } catch (e) { }
            setLoading(false);
        }

        fetchData();
    }, [])

    return (
        <>
            <WishlistTable products={products} />
            {loading || products.length === 0 ?
                <div className="no-table-items font-18">
                    {loading ? <Spinner className="table-spinner" animation="border" /> : "No wishlisted items found"}
                </div> : null}
        </>
    );
}

export default Wishlist;
