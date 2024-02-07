// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const Navbar = () => {
    const navigate = useNavigate();

//   const history = useHistory();

  const userLoggedIn = true; // Replace with your logic to check if the user is logged in
  const userIsAdmin = false; // Replace with your logic to check if the user is an admin

  const handleLogout = () => {
    // Implement logout logic, and redirect to the home page
    navigate.push('/');
  };

  const handleAddProducts = () => {
    // Implement logic for admin to add products
    navigate.push('/add-products');
  };

  return (
    <AppBar position="sticky" className="navbar">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <ShoppingCartIcon />
        </IconButton>
        <Typography variant="h6" className="navbar__title">
          upGrad Eshop
        </Typography>
        <div className="navbar__search">
          <div className='navbar__search__container'>
            <SearchIcon />
            <InputBase
                placeholder="Search products..."
                inputProps={{ 'aria-label': 'search' }}
                className="navbar__search-input"
            />
          </div>
        </div>
        
        {userLoggedIn || userIsAdmin ? (
          <>
            <Link to="/" className="navbar__link">Home</Link>
            {userIsAdmin && (
                <Link to="/add-products" className="navbar__link">Add Product</Link>
            )}
            <Button color="secondary" onClick={handleLogout} className="navbar__button navbar__button-logout">
            Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Login</Link>
            <Link to="/signup" className="navbar__link">Signup</Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
