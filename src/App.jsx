import React from 'react';
import { Button } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login"
import { Main } from "./pages/Main";
import { Project } from "./pages/Project";


const App = () => (
  <Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/*' element={<Main/>}/>
  </Routes>
);

export default App;