import React, { useEffect, useState } from 'react';
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, Card,List,Tooltip,message,Tag,DatePicker,Avatar   } from 'antd';
import VirtualList from 'rc-virtual-list';
import { SearchInput } from './SelectInput';
import { Navigate, Outlet, useNavigate, NavLink } from "react-router-dom";

import {
    CloseOutlined,
    PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';

export const Task = ({isOpen, onClose, task}) => {
    const [executors, setExecutors] = useState([]);
    const [comments, setComments] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [comment, setComment] = useState('');
    const getComments = async() => {
        let response = await axios.get(`http://localhost:3000/comments/task/${task.id}`);
        setComments(response.data)
    }
    useEffect(()=>{
        if(isOpen){
            setExecutors(task.executors);
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setPriority(task.priority);
            setType(task.type);
            getComments();
        }
        else{
            setComments([]);
        }
    },[isOpen])

    const onWrapperClick = (event) => {
        if (!event.target.closest(".model-wrapper")) {
            onClose();
        }
    }

    const handleSave = () => {
        task.title = title
        task.description = description
        task.status = status
        task.type = type
        task.priority = priority
        const updateTask = {
            title: title,
            description: description,
            status: status,
            type: type,
            priority: priority
          };
          axios.put(`http://localhost:3000/tasks/${task.id}`, updateTask);
    }

    const onScroll = (e) => {
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
        }
      };

    const addExecutor = async (id) => {
        const response = await axios.post(`http://localhost:3000/tasks/${task.id}/executors/${id}`, {
        });
        const responseTask = await axios.get(`http://localhost:3000/tasks/${task.id}`, {
        });
        task.executors = responseTask.data.executors;
        setExecutors(responseTask.data.executors);
    }

    const addComment = async () =>{
        let user = JSON.parse(localStorage.getItem('user'));
        let response = await axios.post('http://localhost:3000/comments', {
            text: comment,
            authorId: user.id,
            taskId: task.id
        })
        console.log(response)
        getComments();
    }

    return <>
        {isOpen && (
    <div className='fixed inset-0 w-full h-full bg-sky-200 bg-opacity-75 overflow-hidden overflow-y-auto transition-opacity duration-300 z-[999]'>
        <div className='absolute inset-0 flex items-center justify-center w-full min-h-full'>
            <div className='model-wrapper relative w-full max-w-[1000px] rounded-[20px] bg-white p-4 transform transition-opacity duration-300 translate-y-[-10px]'>
                <div className="flex justify-center flex-col">
                    <div className='flex justify-end'>
                        <Button type="text" icon={<CloseOutlined />} onClick={onClose}></Button>
                    </div>
                    <div className="flex w-full p-4 justify-between">
                        <div className='min-w-[250px]'>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            defaultValue={task.title}
                            className="mt-1 mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter task title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <Input.TextArea 
                            rows={4}
                            defaultValue={task.description}
                            className="mt-1   mb-4 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter task description"
                            style={{ resize: 'none' }}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        </div>
                        <div className='pl-6'>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <Select  
                            className='min-w-[150px] mt-2'  
                            defaultValue={task.status}                        
                            options={[
                            { value: 'BackLog', label: 'BackLog' },
                            { value: 'To Do', label: 'To Do' },
                            { value: 'In Progress', label: 'In Progress' },
                            { value: 'Done', label: 'Done' },
                            ]}
                            onChange={(value) => setStatus(value)}
                        />
                        <label className="block text-sm font-medium text-gray-700 pt-5">Type</label>
                        <Select  
                            className='min-w-[150px] mt-2'   
                            defaultValue={task.type}                       
                            options={[
                            { value: 'Bug', label: 'Bug' },
                            { value: 'Task', label: 'Task' },
                            { value: 'Epic', label: 'Epic' },
                            ]}
                            onChange={(value) => setType(value)}
                        />
                        <label className="block text-sm font-medium text-gray-700 pt-2">Priority</label>
                        <Select  
                            className='min-w-[150px] mt-2'
                            defaultValue={task.priority}                          
                            options={[
                            { value: 'Low', label: 'Low' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'High', label: 'High' },
                            ]}
                            onChange={(value) => setPriority(value)}
                        />
                        </div>
                        <div className='pl-6 flex-grow flex flex-col'>
                        <label className="block text-sm font-medium text-gray-700">Executors</label>
                        <SearchInput
                            className='mt-2 w-full '
                            onChange={(id) => addExecutor(id)}
                        />
                        <div className='bg-sky-50 h-full rounded-lg mt-3' style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {executors.map((tag) => {
                            const isLongTag = tag.email.length > 20;
                            const displayTitle = isLongTag ? `${tag.email.slice(0, 20)}...` : tag.email;
                            const tagElem = (
                            <Tag
                                key={tag.id}
                                color="processing"
                                closable
                                className='m-2'
                                style={{
                                    userSelect: 'none',
                                }}
                            >
                            {displayTitle}
                            </Tag>
                            );
                            return isLongTag ? (
                                <Tooltip title={tag.email} key={tag.id}>
                                    {tagElem}
                                </Tooltip>
                            ) : (
                                tagElem
                            );
                            })}
                            </div>
                        </div>
                        <div className='flex ml-5 flex-grow flex-col'>
                        <label className="block text-sm font-medium text-gray-700">Comments</label>
                           <div className='flex'>
                           <Input
                           onChange={(e) => setComment(e.target.value)}
                                className='w-full mr-2'
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={addComment}></Button>
                           </div>
                             <List style={{ paddingTop: '20px' }}>
                                <VirtualList
                                    data={comments}
                                    itemKey="text"
                                    height={150}
                                    itemHeight={47}
                                    onScroll={onScroll}>
                                    {(item) => (
                                        <List.Item style={{ borderBottom: 'none' }} className='hover:bg-sky-50 transition-all duration-300 ease-in-out rounded-lg' key={item.id}>
                                        <List.Item.Meta
                                        avatar={<Avatar style={{ marginLeft: '10px' }} />}
                                        title={<label className='text-[14px] font-thin'>{item.author.email}</label>}
                                        description={item.text}
                                    />
                                    </List.Item>
                                    )}
                                </VirtualList>
                            </List>
                        </div>
                    </div>
                    <div className='flex'>
                        <Button onClick={handleSave} type="primary">Save</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
        )}
    </>
};