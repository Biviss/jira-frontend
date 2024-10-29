import { Navigate, Outlet, useNavigate,NavLink } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import React from 'react';
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, } from 'antd';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BilibiliOutlined,
    LaptopOutlined,
    NotificationOutlined
  } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const items1 = [
  { key: 'projects', label: <NavLink to="/projects">Projects</NavLink> },
  { key: 'tasks', label: <NavLink to="/tasks">Tasks</NavLink> },
  { key: 'report', label: <NavLink to="report">Report</NavLink> },  
];


export const DeveloperMain = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer},
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
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
              items={items1}
              style={{
              flex: 1,
              justifyContent: 'center', 
              }}/>
          </div>
        </Header>
        <Content style={{background: colorBgContainer}}>
          <Routes>
            <Route path='/projects/*'/>
          </Routes>
        </Content>
    </Layout>
  );
};
