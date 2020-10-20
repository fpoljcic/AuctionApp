import React, { useEffect } from 'react';
import { useBreadcrumbContext } from 'AppContext';

import './myAccount.css';

const MyAccount = () => {
    const { setBreadcrumb } = useBreadcrumbContext();

    useEffect(() => {
        setBreadcrumb("MY ACCOUNT", []);
        // eslint-disable-next-line 
    }, [])

    return (
        <div>
            MyAccount
        </div>
    );
}

export default MyAccount;
