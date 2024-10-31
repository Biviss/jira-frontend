import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
import { Navigate, Outlet, useNavigate,NavLink, } from "react-router-dom";
import axios from "axios";


export const CreateProject = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1)
  }
  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/verify_user`, {
      params: {
        token: token,
      },
    });

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/projects`, {
      title: title,
      description: description,
      creator: {
        id: userResponse.data.id,
      },
    })
    navigate(-1)
  };
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1 className="font-barlow text-4xl">Create Project</h1>
      <Form
        name="project_form"
        layout="vertical">
        <Form.Item
          label="Project Name"
          name="name"
          rules={[{ required: true, message: 'Please input the project name!' }]}
        >
          <Input placeholder="Enter project name" onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter project description" rows={4} onChange={(e) => setDescription(e.target.value)}/>
        </Form.Item>

        <Form.Item>
            <dev className="flex justify-between">
            <Button type="primary" htmlType="submit" onClick={handleCreate}>
            Create Project
          </Button>
          <Button type="primary" danger htmlType="submit" onClick={handleCancel}>
            Cancel
          </Button>
            </dev>
        </Form.Item>
      </Form>
    </div>
  );
};
