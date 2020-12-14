import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ListGroup, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { BsBell, BsBellFill } from 'react-icons/bs';
import { getNotifications, checkNotifications } from 'api/notification';
import { hostUrl } from 'api/common';
import { getUserId } from 'utilities/localStorage';
import { soundUrl } from 'utilities/common';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import './notificationBell.css';

var newNotifCount = 0;

const NotificationBell = () => {
    const personId = getUserId();
    const history = useHistory();
    const notificationSound = new Audio(soundUrl);

    const myRef = useRef(null);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(16);
    const [lastPage, setLastPage] = useState(true);

    const [count, setCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [notification, setNotification] = useState(null);

    const receiveNotification = (message) => {
        setNotification(JSON.parse(message.body));
    }

    useEffect(() => {
        if (page !== 0) {
            const fetchData = async () => {
                try {
                    let newPage = page;
                    let newSize = size;
                    if (newNotifCount !== 0) {
                        newPage = 1;
                        newSize = page * size + newNotifCount;
                        setPage(newPage);
                        setSize(newSize);
                        newNotifCount = 0;
                    }
                    const data = await getNotifications(newPage, newSize);
                    const uncheckedCount = data.notifications.filter(notif => !notif.checked).length;
                    setNotifications([...notifications, ...data.notifications]);
                    setLastPage(data.lastPage);
                    setCount(count + uncheckedCount);
                } catch (e) { }
            }
            fetchData();
        }
        // eslint-disable-next-line
    }, [page])


    useEffect(() => {
        if (notification !== null) {
            setNotifications([notification, ...notifications]);
            setCount(count + 1);
            newNotifCount++;
            notificationSound.play();
        }
        // eslint-disable-next-line
    }, [notification])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getNotifications(page, size);
                const uncheckedCount = data.notifications.filter(notif => !notif.checked).length;
                setNotifications(data.notifications);
                setLastPage(data.lastPage);
                setCount(uncheckedCount);
                setLoading(false);
            } catch (e) { }
        }

        const socket = new SockJS(hostUrl + '/push');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            if (stompClient.connected)
                stompClient.subscribe('/topic/' + personId, receiveNotification);
        });

        fetchData();

        return () => stompClient.disconnect();

        // eslint-disable-next-line
    }, [personId])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (myRef.current && !myRef.current.contains(event.target) && document.body.contains(event.target))
                setMenuVisible(false);
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [myRef])

    const itemClick = (notification) => {
        notification.checked = true;
        history.push(notification.url);
        setMenuVisible(false);
    }

    const bellClick = async () => {
        const isOpened = !menuVisible;
        setMenuVisible(!menuVisible);
        if (count > 0 && isOpened) {
            const uncheckedIds = notifications
                .filter(notif => notif.checked === false)
                .map(notif => notif.id);
            try {
                await checkNotifications(uncheckedIds);
                setCount(0);
            } catch (e) { }
        }
    }

    return (
        <div style={{ position: 'relative' }} ref={myRef}>
            {count !== 0 ?
                <>
                    <BsBellFill className="notif-bell" onClick={bellClick} />
                    <div className="notif-count" onClick={bellClick}>
                        {count}
                    </div>
                </> : <BsBell className="notif-bell" onClick={bellClick} />}
            {menuVisible ?
                <ListGroup variant="notifications">
                    {notifications.length !== 0 ?
                        <>
                            {notifications.map((notification, i) => (
                                <ListGroup.Item
                                    style={!notification.checked ? { backgroundColor: 'var(--info-background)' } : null}
                                    key={notification.id}
                                    onClick={() => itemClick(notification)}
                                >
                                    <div className={"dot-" + notification.type}>•</div>
                                    <div className="notif-description">
                                        {notification.description}
                                    </div>
                                    <div className="notif-seperator" />
                                    <div className="notif-product-name">
                                        {notification.name}
                                        <br />
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={
                                                <Tooltip>
                                                    {notification.productId}
                                                </Tooltip>
                                            }
                                        >
                                            <div style={{ margin: '0 auto' }} className="product-table-id">
                                                #{notification.productId.substring(0, 8)}
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </ListGroup.Item>
                            ))}
                            {!lastPage ?
                                <ListGroup.Item className="notif-load-more" onClick={() => setPage(page + 1)}>
                                    Load more
                                </ListGroup.Item> : null}
                        </>
                        :
                        loading ?
                            <Spinner className="notif-spinner" animation="border" size="sm" /> :
                            <div className="no-notif-items">
                                No notifications found
                            </div>
                    }
                </ListGroup> : null}
        </div>
    )
}

export default NotificationBell;
