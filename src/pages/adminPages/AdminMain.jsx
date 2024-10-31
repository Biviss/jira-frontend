import { Navigate, Outlet, useNavigate,NavLink } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import React from 'react';
import { ProjectsList } from "./ProjectsList";
import { Project } from "./Project";
import { Tasks } from "./Tasks";
import { Task } from "../../components/Task";
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, } from 'antd';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { TaskContext } from "../../context/TaskContext";
import { SubTaskProvider } from "../../context/SubTaskContext";
import {
  BilibiliOutlined,
} from '@ant-design/icons';
import { Notification } from "./Notification";
import { NotificationContext } from "../../context/NotificationContext";
import axios from "axios";

const { Header, Content, Footer, Sider } = Layout;
 
export const AdminMain = ({}) => {
  const { state: userState, dispatch: userDispatch } = useContext(UserContext);
  const { state: taskState, dispatch: taskDispatch } = useContext(TaskContext);
  const { state: notificationState,dispatch:notificationDispatch} = useContext(NotificationContext);


  const [isOpenTask, setIsOpenTask] = useState(false);
  const [openTask, setOpenTask] = useState();
  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`);
        setData(response.data);
        if (data.length !== response.data.length) {
          notificationDispatch({ type: 'SET_NOTIFICATION' });
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 5000);

    return () => clearInterval(intervalId);
  }, [data]);

  const {
    token: { colorBgContainer},
  } = theme.useToken();

  const navigate = [
    { key: 'projects', label: <NavLink to="projects">Projects</NavLink> },
    { key: 'notification', label: <div>
        <NavLink to="notification">Notification</NavLink> 
        {notificationState.hasNotification && (<div className="absolute m-2 bottom-0 right-0 w-2 h-2 bg-yellow-500 rounded-full border border-white" />)}
    </div>},
  ];

  return (
    <Layout className="h-full">
       <Header
        style={{
          background: colorBgContainer,
          display: 'flex',          
          alignItems: 'center',     
          justifyContent: 'space-between', 
          padding: 0,
        }}>
          <BilibiliOutlined className="text-blue-500" style={{fontSize: '27px',marginLeft: '20px', }}/>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              items={navigate}
              style={{
              flex: 1,
              justifyContent: 'center', 
              }}/>
          </div>
        </Header>
        <Content className="h-full w-full" style={{background: colorBgContainer}}>
          <Routes>
            <Route path='projects/*' element={<ProjectsList />}/>
            <Route path='projects/:id/tasks/*' element={<Project/>}/>
            <Route path='notification/*' element={<Notification/>}/>
          </Routes>
        </Content>
        <SubTaskProvider>
        <Task isOpen={taskState.isOpenTask} onClose={() => taskDispatch({ type: 'CLOSE_POPUP' })} task={taskState.selectedTask}/>
        </SubTaskProvider>
    </Layout>
  );
};
