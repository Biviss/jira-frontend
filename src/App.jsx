import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Login from "./pages/Login"
import { AdminMain } from "./pages/adminPages/AdminMain";
import { DeveloperMain } from "./pages/developerPages/DeveloperMain";

import { Project } from "./pages/adminPages/Project";
import { CreateProject } from "./pages/adminPages/CreateProject";
import { EditProject } from "./pages/adminPages/EditProject";

import axios from "axios";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmin";
import ProtectedRouteDeveloper  from "./routes/ProtectedRouteDeveloper";
import { UserProvider } from "./context/UserContext";
import { TaskProvider } from "./context/TaskContext";

const App = () => {
  return (
    <UserProvider>
        <TaskProvider>
        <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRouteAdmin />}>
        <Route exact path="/admin/*" element={<AdminMain />} />
        <Route exact path='/admin/projects/createProject' element={<CreateProject />} />
        <Route exact path='/admin/projects/editProject/:id' element={<EditProject />} />
      </Route>
      <Route element={<ProtectedRouteDeveloper />}>
        <Route exact path="/*" element={<DeveloperMain />} />
      </Route>
    </Routes>
        </TaskProvider>
    </UserProvider>
    
  );
};

export default App;