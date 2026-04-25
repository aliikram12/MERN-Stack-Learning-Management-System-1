import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import WhatsAppButton from '../WhatsAppButton';

const PublicLayout = ({ onToggleSidebar }) => {
  const location = useLocation();
  const showWhatsApp = ['/', '/about', '/courses'].includes(location.pathname);

  return (
    <div className="public-layout">
      <Navbar onToggleSidebar={onToggleSidebar} />
      <main className="main-content">
        <Outlet />
      </main>
      {showWhatsApp && <WhatsAppButton />}
      <Footer />
    </div>
  );
};

export default PublicLayout;
