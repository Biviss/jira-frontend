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

const { Header, Content, Footer, Sider } = Layout;

const navigate = [
  { key: 'projects', label: <NavLink to="projects">Projects</NavLink> },
  { key: 'notification', label: <NavLink to="notification">Notification</NavLink> },
];

export const AdminMain = ({}) => {
  const { state: userState, dispatch: userDispatch } = useContext(UserContext);
  const { state: taskState, dispatch: taskDispatch } = useContext(TaskContext);

  const [isOpenTask, setIsOpenTask] = useState(false);
  const [openTask, setOpenTask] = useState();

  const {
    token: { colorBgContainer},
  } = theme.useToken();

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
          </Routes>
        </Content>
        <SubTaskProvider>
        <Task isOpen={taskState.isOpenTask} onClose={() => taskDispatch({ type: 'CLOSE_POPUP' })} task={taskState.selectedTask}/>
        </SubTaskProvider>
    </Layout>
  );
};
