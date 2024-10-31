import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import { useParams } from 'react-router-dom';
import React from 'react';
import { useDrag,useDrop } from 'react-dnd'
import {DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, Card,List,Tooltip,message  } from 'antd';

import { useMediaQuery } from 'react-responsive';

import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import { TaskContext } from "../../context/TaskContext";
import { Section } from "../../components/Section";

const { Text, Link } = Typography;
const { Option } = Select;

export const DashBoard = () => {
  const { state: taskState, dispatch: taskDispatch } = useContext(TaskContext);
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [backLogTask, setBackLogTask] = useState([]);
  const [toDoTask, setToDoTask] = useState([]);
  const [inProgressTask, setInProgressTask] = useState([]);
  const [doneTask, setDoneTask] = useState([]);
  const [filterTasks, setFilterTasks] = useState([]);
  const [executor, setExecutor] = useState('');
  const [priority, setPriority] = useState('');
  const [type, setType] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [title, setTitle] = useState('');

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  const handleCreate = (index) => {
    setActiveSection(index);
  };

  const handleAdd = async (status) => {
    if(title === ''){
      return;
    }
    const currentDate = new Date();
    const deadline = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
    const newTask = {
      title: title,
      description: "This is the Task1",
      status: status,
      type: "Task",
      project: {
        id: id,
      },
      deadline: deadline.toISOString().split('T')[0],
      priority: "Medium",
    };
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tasks`, newTask, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Task added successfully:', response.data);
    appendData();
    setActiveSection(null);
  };
  
  const appendData = async () => {
    let response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/projects/${id}`);
    setTasks(response.data.tasks);
    setFilterTasks(response.data.tasks)
  };

  useEffect(() => {
    appendData();
  },[taskState.isOpenTask]);

  useEffect(() => {
    appendData();
  }, []);

  useEffect(() => {
    setInProgressTask(filterTasks.filter((task) => task.status == "In Progress"));
    setDoneTask(filterTasks.filter((task) => task.status == "Done"));
    setToDoTask(filterTasks.filter((task) => task.status == "To Do"));
    setBackLogTask(filterTasks.filter((task) => task.status == "BackLog"));

  }, [filterTasks]); 

  const statuses = ["BackLog", "To Do", "In Progress", "Done"];

  const handleSeach = () => {
    setFilterTasks(tasks.filter(item => 
      item.type.toLowerCase().includes(type.toLowerCase()) &&
      item.priority.toLowerCase().includes(priority.toLowerCase()) &&
      item.executors.some(exe => 
          exe.email.toLowerCase().includes(executor.toLowerCase())
      )
    ));
    console.log(filterTasks)
  }

  const handleClickOutside = (event) => {
    if (!event.target.closest(".section-container")) {
      setActiveSection(null);
    }
  };

  const cancelClick = () => {
    setActiveSection(null);
  };

  const handleDelete = async (id) => {
    const updatedData = tasks.filter(element => element.id !== id);
    setFilterTasks(updatedData);
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`);
    message.success('Task deleted successfully!');
    appendData();
  };

  return (
    <div className="" onClick={handleClickOutside}>
      <div className="flex" style={{ paddingLeft: '40px', paddingTop: '20px', paddingRight: '40px' }}>
        <div>
          <Select
          defaultValue="All"
          style={{ width: 120,marginRight: '20px'}}
          onChange={(e) => {
            if(e === "All"){
              setType('');
            }
            else{
              setType(e);
            }
          }}
          options={[
            { value: 'Bug', label: 'Bug' },
            { value: 'Task', label: 'Task' },
            { value: 'Epic', label: 'Epic' },
            { value: 'All', label: 'All' },
          ]}
          />
          <Select
            defaultValue="All"
            style={{ width: 120,marginRight: '20px' }}
            onChange={(e) => {
              if(e === "All"){
                setPriority('');
              }
              else{
                setPriority(e);
              }
            }}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'All', label: 'All' },
            ]}
          />
        </div>
       <div className="flex">
        <Input className="mr-[20px]" onPressEnter={handleSeach} onChange={(e) => setExecutor(e.target.value)}/>
        <Tooltip title="search">
          <Button shape="circle" onClick={handleSeach} icon={<SearchOutlined />} />
        </Tooltip>
       </div>
      </div>
      <DndProvider backend={HTML5Backend}>
      <div className="flex overflow-x-auto" style={{ paddingLeft: '30px', paddingTop: '15px', paddingRight: '30px'}}>
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={filterTasks}
          setTasks={setFilterTasks}
          taskList={
            status === "BackLog" ? backLogTask
            : status === "To Do" ? toDoTask
            : status === "In Progress" ? inProgressTask
            : doneTask
          }
          isActive={activeSection === index}
          onActivate={() => handleCreate(index)}
          onDeactivate={() => handleAdd(status)}
          setTitle={setTitle}
          handleDelete={handleDelete}
          cancelClick={cancelClick}
        />
      ))}
     </div>
    </DndProvider>
    </div>
  );
};