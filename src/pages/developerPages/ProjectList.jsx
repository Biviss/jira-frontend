import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Button, List, Skeleton, message, Popconfirm, Input, Tooltip } from 'antd';
import VirtualList from 'rc-virtual-list';
import { Navigate, Outlet, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { BookOutlined, SearchOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
const ContainerHeight = 400;

export const ProjectList = () => {
    const { state: userState, dispatch: userDispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    const appendData = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        fetch(`http://localhost:3000/auth/projects/${user.id}`)
            .then((res) => res.json())
            .then((body) => {
                setData(body);
            });
    };
    const onScroll = (e) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
        }
      };

    useEffect(() => {
        appendData();
    }, []);

    const filteredData = data.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                <div>
                    <Input
                        placeholder="Search project"
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: '200px', marginLeft: '10px', marginRight: '10px' }}
                    />
                </div>
            </div>
            <List style={{ paddingTop: '20px' }}>
                <VirtualList
                    data={filteredData}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="id"
                    onScroll={onScroll}>
                    {(item) => (
                        <List.Item style={{ borderBottom: 'none' }} className='hover:bg-sky-50 transition-all duration-300 ease-in-out rounded-lg' key={item.id}>
                            <List.Item.Meta
                                avatar={<Avatar style={{ marginLeft: '10px' }} />}
                                title={<NavLink to={`${item.id}/tasks`}>{item.title}</NavLink>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    );
};
