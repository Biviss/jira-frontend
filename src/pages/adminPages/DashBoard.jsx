import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState,useContext,useRef } from 'react'
import { useParams } from 'react-router-dom';
import React from 'react';
import { useDrag,useDrop } from 'react-dnd'
import {DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, Card,List,Tooltip,message  } from 'antd';

import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import { TaskContext } from "../../context/TaskContext";

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

  const handleCreate = (index) => {
    setActiveSection(index);
  };

  const handleAdd = async (status) => {
    if(title === ''){
      return;
    }
    const newTask = {
      title: title,
      description: "This is the Task1",
      status: status,
      type: "Task",
      project: {
        id: id,
      },
      deadline: "2024-10-15",
      priority: "Medium",
    };
    const response = await axios.post('http://localhost:3000/tasks', newTask, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Task added successfully:', response.data);
    appendData();
    setActiveSection(null);
  };

  const appendData = async () => {
    let response = await axios.get(`http://localhost:3000/projects/${id}`);
    setTasks(response.data.tasks);
    setFilterTasks(response.data.tasks)
    console.log(response.data.tasks)
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
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    message.success('Task deleted successfully!');
    appendData();
  };

  return (
    <div onClick={handleClickOutside}>
      <div className="flex justify-between" style={{ paddingLeft: '40px', paddingTop: '20px', paddingRight: '40px' }}>
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
       <div className="flex" >
        <Input style={{marginRight: '20px'}} onChange={(e) => setExecutor(e.target.value)}/>
        <Tooltip title="search">
          <Button shape="circle" onClick={handleSeach} icon={<SearchOutlined />} />
        </Tooltip>
       </div>
      </div>
      <DndProvider backend={HTML5Backend}>
      <div className="flex gap-16 justify-center" style={{ paddingLeft: '30px', paddingTop: '15px', paddingRight: '30px'}}>
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

const Section = ({ status, tasks, setTasks, taskList,isActive, onActivate, onDeactivate,setTitle,handleDelete,cancelClick }) => {
  const [addAction, setAddAction] = useState(false);
  const { state: taskState, dispatch: taskDispatch } = useContext(TaskContext);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: (item) => addItemToSection(item.id),
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    []
  )

  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map(t => {
        if(t.id === id){
          t.status = status;
          const response = axios.patch(`http://localhost:3000/board/${id}/status`, { status });
          return t;
        }
        return t;
      })
      return mTasks;


    });
  }

  const handleClick = (task) =>{
    taskDispatch({ type: 'OPEN_POPUP', payload: task });        
  }

  return (
    <div ref={drop} className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-100" : ""}`}>
      <Header text={status} />
      {taskList.map((task) => (
        <Task onClick={() => handleClick(task)} key={task.id} task={task} tasks={tasks} setTasks={setTasks} handleDelete={handleDelete} />
      ))}
      {isActive && <NewTask text={status} addClick={onDeactivate} setTitle={setTitle} cancelClick={cancelClick}/>}
      {!isActive && <Adder text={status} onClick={onActivate} />}
     
    </div>
  );
};

const Header = ({ text }) => {
  return <div className="flex bg-sky-400 items-center justify-between h-12 pl-4 rounded-md uppercase text-sm text-white">
    <div>
      {text}
    </div>
  </div>;
};

const Task = ({ task,handleDelete,onClick }) => {

  let bg = "bg-zinc-100";
  let text = "text-black-400"
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "task",
      item: {id: task.id},
      collect: (monitor) => ({
        opacity: !!monitor.isDragging()
      })
    }),
    []
  )
  if(task.type === "Bug"){
    bg = "bg-amber-300"
  }
  if(task.status === "Done"){
    bg = "bg-green-500"
    text = "text-white"
  }


  return (
    <div ref={dragRef} className={`flex ${bg} ${text} relative mt-3 rounded-md ${opacity ? "opacity-25" : "opacity-100"}`}>
      <p onClick={onClick} className="p-2 flex-1 m-1">{task.title}</p>
      <Button onClick={() => handleDelete(task.id)} shape="circle" color="default" variant="text" className={`absolute bottom-1 right-1 ${text}`} icon={<MinusOutlined className="size-2" />}>
      </Button>
    </div>
  );
};

const Adder = ({ text,onClick}) => {
  return <div onClick={onClick} className={`section-container flex bg-zinc-50 relative p-2 mt-2 rounded-md opacity-10 justify-center hover:opacity-100`}>
    <PlusOutlined />
  </div>;
};

const NewTask = ({setTitle, addClick, cancelClick}) => {
  return <div className={`section-container flex bg-zinc-50 relative p-2 mt-2 rounded-md flex-col`}>
    <div className="mb-2 flex">
    <Input onChange={(e) => setTitle(e.target.value)} onPressEnter={addClick} className="mr-2"/>
    <Button className=" text-white w-4" type="primary" danger onClick={cancelClick}>X</Button>
    </div>
    <Button className="bg-green-300 text-white" onClick={addClick}>Add</Button>
  </div>;
};

