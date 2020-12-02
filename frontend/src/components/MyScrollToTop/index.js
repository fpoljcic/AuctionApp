import React from 'react';
import ScrollToTop from "react-scroll-up";
import { HiArrowUp } from 'react-icons/hi';
import { isTouchDevice } from 'utilities/common';

const MyScrollToTop = () => {

    return !isTouchDevice ? (
        <ScrollToTop style={{ zIndex: 100 }} showUnder={1509}>
            <HiArrowUp style={{ fontSize: 48, color: 'var(--primary)' }} />
        </ScrollToTop>
    ) : null;
}

export default MyScrollToTop;
