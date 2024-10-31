import React, { useEffect, useState, useContext } from 'react';
import { CloseOutlined, PlusOutlined, MinusOutlined, UserOutlined } from '@ant-design/icons';
import { TaskContext } from '../context/TaskContext';
import { SubTaskContext } from '../context/SubTaskContext';
import { Button, Input, Popover } from 'antd';
import axios from 'axios';
import './style.css'

export const Section = ({}) => {
    const { state: taskState, dispatch: taskDispatch } = useContext(TaskContext);
    const { state: subTaskState, dispatch: subTaskDispatch } = useContext(SubTaskContext);
    const [tasks, setTasks] = useState([]);
    
    const appendSubTasks = async() =>{
      const response = await axios.get(`http://localhost:3000/tasks/subtasks/${taskState.selectedTask.id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      setTasks(response.data);
    }
    useEffect(() => {
      appendSubTasks();
  }, []);

  const deleteSubTaskHandler = async (task) => {
    const response = await axios.delete(`http://localhost:3000/subtasks/${task.id}`, {
      headers: {
          'Content-Type': 'application/json',
      },
    });
    appendSubTasks();
  }

    const addClick = async (title) => {
        let subTask = {
            "title": title,
            "status": "In Progress",
            "taskId": taskState.selectedTask.id,
        };
        await axios.post('http://localhost:3000/subtasks', subTask, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        subTaskDispatch({ type: 'CLOSE_ADD_FORM' });
        appendSubTasks();
    };

    const addExecutorClick = async (subTask, executorId) => {
      let addExecutorSubTask = {
          "title": subTask.title,
          "status": subTask.status,
          "executorId":executorId,
          "taskId": taskState.selectedTask.id,
      };
      await axios.put(`http://localhost:3000/subtasks/${subTask.id}`, addExecutorSubTask, {
          headers: {
              'Content-Type': 'application/json',
          },
      });
      appendSubTasks();
  };

    return (
        <div className="custom-scrollbar w-40 rounded-md max-h-40 overflow-y-auto">
            {subTaskState.isAddSubTask && (
                <SubNewTask addClick={addClick} cancelClick={() => subTaskDispatch({ type: 'CLOSE_ADD_FORM' })} />
            )}
            {tasks.map((task) => (
                <SubTask addExecutor={(subTask,executorId) => addExecutorClick(subTask,executorId)} deleteSubTask={() => deleteSubTaskHandler(task)} key={task.id} task={task} executors={taskState.selectedTask.executors} />
            ))}
        </div>
    );
};

const SubTask = ({ task, executors, deleteSubTask, addExecutor }) => {
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);

    const handleHoverChange = (visible) => {
        setOpen(false);
        setHovered(visible);
    };

    const handleClickChange = (visible) => {
        setOpen(visible);
        setHovered(false);
    };

    let bg = "bg-sky-50";
    let text = "text-black-400";
    if (task.type === "Bug") {
        bg = "bg-amber-300";
    }
    if (task.status === "Done") {
        bg = "bg-green-500";
        text = "text-white";
    }

    return (
        <div className={`flex ${bg} ${text} rounded-md relative mt-1`}>
            <p className="p-2 flex-1 m-1">{task.title}</p>
            <Popover
                content={task.executorEmail ? <label>{task.executorEmail}</label> : <label>None</label>}
                trigger="hover"
                open={hovered}
                onOpenChange={handleHoverChange}>
                <Popover
                    content={
                      executors.length === 0 
                          ? <span>None</span> 
                          : executors.map((e, index) => (
                              <a onClick={() => {
                                setOpen(false);
                                setHovered(false);
                                addExecutor(task, e.id)}
                              } key={index}>{e.email}</a>
                          ))
                    }
                    trigger="click"
                    open={open}
                    onOpenChange={handleClickChange}>
                    <Button
                        shape="circle"
                        color="default"
                        variant="text"
                        className="mt-1"
                        icon={<UserOutlined />}/>
                </Popover>
            </Popover>
            <Button onClick={deleteSubTask} shape="circle" color="default" variant="text" className="mt-1" icon={<MinusOutlined className='size-2'/>} />
        </div>
    );
};

const SubNewTask = ({ addClick, cancelClick }) => {
    const [title, setTitle] = useState('');

    const handleAddClick = () => {
        addClick(title);
        setTitle('');
    };

    return (
        <div className="section-container flex bg-sky-50 p-1 relative mt-2 rounded-md flex-col">
            <div className="flex">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onPressEnter={handleAddClick}
                    className="mr-1"
                />
                <Button className="w-4" type="text" icon={<CloseOutlined />} onClick={cancelClick}></Button>
            </div>
        </div>
    );
};

