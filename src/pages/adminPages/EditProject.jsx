import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';

export const EditProject = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/${id}`);
        console.log(response);
        form.setFieldsValue({ 
          name: response.data.title,
          description: response.data.description,
        });
      } catch (error) {
        message.error('Failed to load project data');
        console.log(error);
      }
    };

    loadProject();
  }, [id, form]);

  const handleCancel = () => {
    navigate(-1)
  }
  const handleEdit = async () => {
    const values = await form.validateFields();
    try {
      await axios.put(`http://localhost:3000/projects/${id}`, {
        title: values.name,
        description: values.description,
      });
      message.success('Project updated successfully');
      navigate(-1);
    } catch (error) {
      message.error('Failed to update project');
      console.log(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1 className="font-barlow text-4xl">Edit Project</h1>
      <Form
        form={form}
        name="project_form"
        layout="vertical"
      >
        <Form.Item
          label="Project Name"
          name="name"
          rules={[{ required: true, message: 'Please input the project name!' }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter project description" rows={4} />
        </Form.Item>

        <Form.Item>
          <dev className="flex justify-between">
          <Button type="primary" htmlType="submit" onClick={handleEdit}>
            Edit Project
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
