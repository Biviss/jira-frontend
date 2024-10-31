import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Button, List, Skeleton, message, Popconfirm, Input, Tooltip } from 'antd';
import VirtualList from 'rc-virtual-list';
import { Navigate, Outlet, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { BookOutlined, SearchOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import { NotificationContext } from "../../context/NotificationContext";

const ContainerHeight = 400;

export const Notification = () => {
    const { state: userState, dispatch: userDispatch } = useContext(UserContext);
    const { state: notificationState,dispatch: notificationDispatch} = useContext(NotificationContext);

    const [data, setData] = useState([]);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const onScroll = (e) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`);
            setData(response.data);
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        };
        fetchNotifications();
        notificationDispatch({type: 'CLEAR_NOTIFICATION'});

      }, [data]);

    return (
        <div style={{ paddingTop: '20px' }}>
            <List style={{ paddingTop: '20px' }}>
                <VirtualList
                    data={data}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="id"
                    onScroll={onScroll}>
                    {(item) => (
                        <List.Item style={{ borderBottom: 'none' }} className='hover:bg-sky-50 transition-all duration-300 ease-in-out rounded-lg' key={item.id}>
                            <List.Item.Meta
                                title={<div className='flex flex-col'>
                                        <div className=''>{item.type}</div>
                                        <div className='font-thin'>{item.text}</div>
                                    </div>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    );
};
