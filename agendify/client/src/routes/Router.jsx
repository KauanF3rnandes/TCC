import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from '../pages/Home/Home';
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Main from "../pages/Main/Main";
import RegisterEmpresa from "../pages/RegisterEmpresa/RegisterEmpresa";
import PrivateRoute from './PrivateRoute';
import Logout from '../pages/Logout/Logout';
import MainAdmin from '../pages/MainAdmin/MainAdmin';
import Agendamentos from '../pages/Agendamentos/Agendamentos';
import Horarios from '../pages/Horarios/Horarios';
import AgendamentosAdmin from '../pages/AgendamentosAdmin/AgendamentosAdmin';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cadastro_empresa" element={<RegisterEmpresa />} />
        <Route element={<PrivateRoute />}>
          <Route path="/main/cliente" element={<Main />} />
          <Route path="/main/admin" element={<MainAdmin />} />
          <Route path="/main/cliente/agendamentos" element={<Agendamentos />} />
          <Route path="/main/admin/horarios" element={<Horarios />} />
          <Route path="/main/admin/agendamentos_empresa" element={<AgendamentosAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
