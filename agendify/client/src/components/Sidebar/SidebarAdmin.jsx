import React, { useState } from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdSpaceDashboard } from "react-icons/md";
import "./style.css";

const SidebarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        <h1 className="logo-text">Agendi<span className="colorize">fy</span></h1>
      </div>
      <ul className="menu">
        <li>
          <a href="/main/admin">
            <FaHome />
            {!collapsed && <span>Home</span>}
          </a>
        </li>
        <li>
          <a href="#">
            <MdSpaceDashboard />
            {!collapsed && <span>dashboard</span>}
          </a>
        </li>
        <li>
          <a href="#">
            <RiCalendarScheduleFill />
            {!collapsed && <span>Agendamentos</span>}
          </a>
        </li>
        <li>
          <a href="/logout">
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </a>
        </li>
      </ul>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? '>' : '<'}
      </button>
    </div>
  );
};

export default SidebarAdmin;
