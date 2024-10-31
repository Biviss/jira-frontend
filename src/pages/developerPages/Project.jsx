import { Navigate, Outlet, useNavigate,NavLink } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, Card,List } from 'antd';

import {
  UnorderedListOutlined,
} from '@ant-design/icons';
import { DashBoard } from "./DashBoard";

const { Header, Content, Sider } = Layout;

export const Project = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{paddingTop: '10px', background: colorBgContainer}}>
        <Sider trigger={null} collapsible collapsed={collapsed}
        style={{
            background: colorBgContainer
          }}>
        <Menu
          theme="light"
          mode="inline"
          style={{ borderRight: 'none'}}
          items={[
            {
              key: '1',
              icon: <UnorderedListOutlined />,
              label:  <NavLink to="list">List</NavLink>,
            },
            {
              key: '2',
              label: <NavLink to="dashboard">DashBoard</NavLink>,
            },
          ]}>
        </Menu>
      </Sider>
      <Content>
        <Routes>
          <Route path='list' />
          <Route path='dashboard' element={<DashBoard/>}/>
        </Routes>
      </Content>
      
    </Layout>
  );
};
