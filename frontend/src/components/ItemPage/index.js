import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getUserId } from 'utilities/Common';
import { getBidsForProduct, getProduct } from 'utilities/ServerCalls';

import './itemPage.css';

const ItemPage = ({ match, setBreadcrumb }) => {

    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        formBreadcrumb();
        const fetchData = async () => {
            const productId = match.params.id;
            setProduct(await getProduct(productId, getUserId()));
            setBids(await getBidsForProduct(productId));
        }

        fetchData();
        // eslint-disable-next-line
    }, [])

    const formBreadcrumb = () => {
        const urlElements = match.url.split("/").slice(1, -1);
        setBreadcrumb("SINGLE PRODUCT", [...urlElements.map((el, i) => {
            return {
                text: el.toUpperCase().split("_").join(" "),
                href: "/" + urlElements.slice(0, i + 1).join("/")
            }
        }), { text: "SINGLE PRODUCT" }]);
    }

    return (
        <div>
            ItemPage
        </div>
    );
}

export default withRouter(ItemPage);
