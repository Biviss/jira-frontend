import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import React from 'react';
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, } from 'antd';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    BilibiliOutlined,
  } from '@ant-design/icons';


const { Text, Link } = Typography;
const { Option } = Select;
const { Header, Sider, Content } = Layout;

const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));


export const Project = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}
        style={{
            background: colorBgContainer,   
          }}>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}>
        Content
      </Content>
    </Layout>
  );
};