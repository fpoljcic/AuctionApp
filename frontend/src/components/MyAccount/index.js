import React, { useEffect } from 'react';

import './myAccount.css';

const MyAccount = ({ setBreadcrumb }) => {

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
