import React, { useEffect } from 'react';
import { homeUrl } from 'utilities/appUrls'; 
import { useBreadcrumbContext } from 'AppContext';

import './allCategories.css';

const AllCategories = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

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

export default AllCategories;
