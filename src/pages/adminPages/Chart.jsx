import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';

const Chart = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [burnDownData, setBurnDownData] = useState([]);

  const appendData = async () => {
    let response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/projects/${id}`);
    setTasks(response.data.tasks);
  };

  useEffect(() => {
    appendData();
  }, []);

  useEffect(() => {
    const statusCount = tasks.reduce(
      (acc, task) => {
        const statusKey = task.status.replace(/\s/g, '');
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
      },
      { BackLog: 0, InProgress: 0, Done: 0, ToDo: 0 }
    );

    setData([
      { name: 'BackLog', value: statusCount.BackLog },
      { name: 'In Progress', value: statusCount.InProgress },
      { name: 'Done', value: statusCount.Done },
      { name: 'To Do', value: statusCount.ToDo },
    ]);
  }, [tasks]);

  useEffect(() => {
    const today = dayjs().startOf('day');
    const endDate = dayjs("2024-12-05");  
    const totalDays = endDate.diff(today, 'day');

    const burnDownData = Array.from({ length: totalDays + 1 }).map((_, index) => {
      const currentDate = today.add(index, 'day');
      const remainingTasks = tasks.filter(task => dayjs(task.deadline).isAfter(currentDate)).length;
      return {
        date: currentDate.format("YYYY-MM-DD"),
        remainingTasks,
      };
    });

    setBurnDownData(burnDownData);
  }, [tasks]);

  const COLORS = ['#FFBB28', '#0088FE', '#00C49F', '#FF8042'];

  return (
    <div className='flex h-[450px] pl-10 flex-col overflow-auto'>
      <h2>Team Progress Chart</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h2>Burn-down Chart</h2>
      <LineChart width={600} height={400} data={burnDownData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="remainingTasks" stroke="#FF0000" name="Remaining Tasks" />
      </LineChart>
    </div>
  );
};

export default Chart;
