// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
