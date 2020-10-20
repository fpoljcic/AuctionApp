import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import { useBreadcrumbContext } from 'AppContext';

import './myBreadCrumb.css';

const MyBreadcrumb = () => {
    const { breadcrumbTitle, breadcrumbItems } = useBreadcrumbContext();

    return breadcrumbTitle !== null ? (
        <Breadcrumb>
            <div className="breadcrumb-title">
                {breadcrumbTitle}
            </div>
            {breadcrumbItems.map((item, i, { length }) => (
                <Breadcrumb.Item active key={item.text}>
                    {length - 1 === i ? (
                        <div style={{ color: 'var(--text-primary)' }}>
                            {item.text}
                        </div>
                    ) : (
                            <Link className="black-nav-link" to={item.href}>
                                {item.text}
                            </Link>
                        )}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    ) : null;
}

export default MyBreadcrumb;
