import { Navigate, Outlet, useNavigate,NavLink } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import React from 'react';
import { Tasks } from "./Tasks";
import { DashBoard } from "./DashBoard";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, Card,List } from 'antd';

import {
  UnorderedListOutlined,
  BarChartOutlined,
  } from '@ant-design/icons';
import Chart from "./Chart";


const { Header, Content, Sider } = Layout;

export const Project = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="h-full w-full" style={{paddingTop: '10px', background: colorBgContainer}}>
        <Sider 
        className="h-full"
        trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="light"
          mode="inline"
          style={{ borderRight: 'none'}}
          defaultSelectedKeys={['1']}
          className="h-full w-full"
          items={[
            {
              key: '1',
              label:  <NavLink to="dashboard">DashBoard</NavLink>,
            },
            {
              key: '2',
              label: <NavLink to="chart">Chart</NavLink>,
            },
          ]}>
        </Menu>
      </Sider>
      <Content>
        <Routes>
          <Route path='chart' element={<Chart/>}/>
          <Route path='dashboard' element={<DashBoard />}/>
        </Routes>
      </Content>
      
    </Layout>
  );
};
