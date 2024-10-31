import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Button, List, Skeleton, message, Popconfirm, Input, Tooltip } from 'antd';
import VirtualList from 'rc-virtual-list';
import { Navigate, Outlet, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { BookOutlined, SearchOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
const ContainerHeight = 400;

export const ProjectsList = () => {
    const { state: userState, dispatch: userDispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    const appendData = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/projects/${user.id}`)
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

    const handleDelete = async (item) => {
        const updatedData = data.filter(element => element !== item);
        setData(updatedData);
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/projects/${item.id}`);
        message.success('Project deleted successfully!');
    };

    const handleCreate = () => {
        navigate('createProject');
    };

    const handleEdit = (item) => {
        navigate(`editProject/${item.id}`);
    };

    const filteredData = data.filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                <Button type="primary" onClick={handleCreate}>Create project</Button>
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
                        <List.Item style={{ borderBottom: 'none' }} className='hover:bg-sky-50 transition-all duration-300 ease-in-out rounded-lg' key={item.id}
                            actions={[
                                <a key="list-loadmore-edit" onClick={() => handleEdit(item)}>Edit</a>,
                                <Popconfirm
                                    title="Are you sure you want to delete this item?"
                                    onConfirm={() => handleDelete(item)}
                                    okText="Yes"
                                    cancelText="No"
                                    key="list-loadmore-delete">
                                    <a style={{ paddingRight: '20px' }} className='text-red-600 hover:text-orange-500'>
                                        Delete
                                    </a>
                                </Popconfirm>,
                            ]}>
                            <List.Item.Meta
                                avatar={<Avatar style={{ marginLeft: '10px' }} />}
                                title={<NavLink to={`${item.id}/tasks/dashboard`}>{item.title}</NavLink>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    );
};
