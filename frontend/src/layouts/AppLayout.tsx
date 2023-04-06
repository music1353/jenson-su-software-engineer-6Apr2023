import React from 'react';
import { Outlet } from 'react-router-dom';
import NavHeader from 'components/common/NavHeader';

const AppLayout: React.FC = () => {
  return (
    <div className="spotlight-app-layout">
      <NavHeader />
      <Outlet />
    </div>
  )
}

export default AppLayout;