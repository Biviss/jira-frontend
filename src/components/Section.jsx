import React, { useEffect, useState } from 'react';
import {useContext,useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useDrag,useDrop } from 'react-dnd'
import {DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import './style.css'
import { Button, Flex ,Space,Col, Row,Table,Typography, Layout,Input,Popconfirm,InputNumber
  ,Form,Dropdown,Menu, Select,Switch, Breadcrumb, theme, Card,List,Tooltip,message  } from 'antd';


import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
  CloseOutlined
} from '@ant-design/icons';

import axios from 'axios';
import { TaskContext } from "../context/TaskContext";


export const Section = ({ status, tasks, setTasks, taskList,isActive, onActivate, onDeactivate,setTitle,handleDelete,cancelClick }) => {
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
  
    const handleClick = async (task) =>{
      let response = await axios.get(`http://localhost:3000/tasks/${task.id}`)
      taskDispatch({ type: 'OPEN_POPUP', payload: response.data });        
    }
  
    return (
      <div ref={drop} className={`w-64 rounded-md p-2 ${isOver ? "bg-slate-100" : ""}`}>
        <Header text={status} />
        <div className="overflow-y-auto max-h-[270px] custom-scrollbar">
        {taskList.map((task) => (
          <Task onClick={() => handleClick(task)} key={task.id} task={task} tasks={tasks} setTasks={setTasks} handleDelete={handleDelete} />
        ))}
        </div>
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
      <Button className="w-4" type="text" icon={<CloseOutlined/>} danger onClick={cancelClick}></Button>
      </div>
      <Button className="bg-green-300 text-white" onClick={addClick}>Add</Button>
    </div>;
  };
  
  