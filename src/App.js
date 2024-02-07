// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
