import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Home from './Common/Home';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Footer from './Common/Footer';
import ProtectedRoute from './Product/ProtectedRoute';
import ProductUpdatePage from './Product/ProductUpdatePage';
import { createProduct, modifyProduct } from '../api/productAPIs';
import ProductDetails from './Product/ProductDetails';
import PlaceOrder from './Order/PlaceOrder';
import BroadcastMessage from './Common/BroadcastMessage';
import Nav from './Common/Nav';
import ErrorPage from './Common/ErrorPage';
import { ADMIN, USER } from '../common';


const PageSetUp = () => {
  return (
    <Router>
      <Nav />
      <Container maxWidth={false} style={{ marginBottom: '30px', marginTop: '85px', paddingTop: '24px' }}>
        <Grid container spacing={2}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={ <Home /> } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/add" element={ <ProtectedRoute role={[ADMIN]}> <ProductUpdatePage mode="CREATE" buttonText="SAVE PRODUCT" headingText="Add Product" callbackFunction={createProduct} /> </ProtectedRoute> }/>
            <Route path="/product/modify" element={ <ProtectedRoute role={[ADMIN]}> <ProductUpdatePage mode="MODIFY" buttonText="MODIFY PRODUCT" headingText="Modify Product" callbackFunction={modifyProduct} /> </ProtectedRoute> } />
            <Route path="/product/view" element={ <ProtectedRoute role={[ADMIN,USER]}> <ProductDetails /> </ProtectedRoute> } />
            <Route path="/product/order" element={ <ProtectedRoute role={[ADMIN,USER]}> <PlaceOrder /> </ProtectedRoute> } />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Grid>
      </Container>
      <Footer />
      <BroadcastMessage />
    </Router>
  );
};

export default PageSetUp;
