import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { homeUrl } from 'utilities/appUrls'; 

import './allCategories.css';

const AllCategories = ({ setBreadcrumb }) => {

    useEffect(() => {
        setBreadcrumb("ALL CATEGORIES", [{ text: "HOME", href: {homeUrl} }, { text: "ALL CATEGORIES" }]);
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            All categories
        </div>
    );
}

export default withRouter(AllCategories);
