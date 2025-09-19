import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AccordionMenu from './AccordionMenu';

const MainLayout: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<'cot-list' | 'settings'>('cot-list');
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuSelect = (menu: 'cot-list' | 'settings') => {
    setActiveMenu(menu);
    if (menu === 'cot-list') {
      navigate('/cot-list');
    } else if (menu === 'settings') {
      navigate('/settings');
    }
  };

  // Update active menu based on current route
  React.useEffect(() => {
    if (location.pathname.startsWith('/cot-list') || location.pathname === '/') {
      setActiveMenu('cot-list');
    } else if (location.pathname.startsWith('/settings')) {
      setActiveMenu('settings');
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
      <AccordionMenu onMenuSelect={handleMenuSelect} activeMenu={activeMenu} />
      <main className="flex-1 overflow-auto bg-transparent">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
