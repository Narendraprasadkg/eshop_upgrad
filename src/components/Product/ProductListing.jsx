import React, { useState } from 'react';
import { connect } from 'react-redux';
import ProductCard from './ProductCard';
import Grid from '@material-ui/core/Grid';
import { Modal } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { initCatalog } from '../../store/actions/metadataAction';
import { deleteProduct } from '../../api/productAPIs';
import useAuthentication from '../../hooks/useAuthentication';
import { ALL, DUMMY_API, baseURL } from '../../common';


const ProductListing = ({ mode, productList, sortBy, category, reFetchAllData }) => {
  const { AuthCtx } = useAuthentication();
  const { loggedInUser } = React.useContext(AuthCtx);
  const [deleteModal, setDeleteModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let searchFor = searchParams.get('searchFor');
  if (searchFor === null) {
    searchFor = '';
  }

  let getFilteredProductsBasedOnQuery = (list, str) => {
    if (str !== null && str.length > 0) {
      return list.filter((product) => product.name.toLowerCase().includes(str.toLowerCase()));
    } else {
      return list;
    }
  };

  let getSortedProducts = (list, s) => {
    if (!s || s === 'DEFAULT') {
      s = 'DEFAULT';
    } else {
        list.sort((a, b) => {
            switch (s) {
                case 'PRICE_ASC':
                    return a.price - b.price;
                case 'PRICE_DESC':
                    return b.price - a.price;
                case 'NEWEST':
                    // NOTE: "NEWEST" criteria won't work as the required data is not available
                    return 0; // No sorting for "NEWEST"
                default:
                    // Default or unknown case
                    return a.price - b.price;
            }
        });
    }
    return list;
  };

  let initiateDeleteProduct = (details) => {
    setProduct(details);
    setDeleteModal(true);
  };

  let initiateModifyProduct = (details) => {
    navigate('/product/modify', {
      state: JSON.stringify({
        value: details,
      }),
    });
  };

  let initiateViewProduct = (details) => {
    if(loggedInUser){
      navigate('/product/view', {
        state: JSON.stringify({
          value: details,
        }),
      });
    }else{
      navigate('/login', {
        state: JSON.stringify({
          value: details,
        }),
      });
    }
  };

  let handleClose = () => {
    setProduct(null);
    setDeleteModal(false);
  };

  const proceedDelete = () => {
    setDeleteModal(false);
    setBusy(true);
    console.log(product)
    deleteProduct(product.id)
    .then((json) => {
      console.log(json)
      reFetchAllData();
      setBusy(false);
    })
    .catch(() => {
      setBusy(false);
    });
  };

  let products = getFilteredProductsBasedOnQuery(getSortedProducts([ALL,null,undefined,''].includes(category) ? productList : productList.filter(f => f.category === category), sortBy), searchFor);

  return (
    <>
      <Grid container>
        {products !== null && products.length > 0 ? (
          products.map((element, index) => (
            <Grid key={`parent_product_${index}`} item xs={12} md={6} lg={4}>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%' }}>
                <ProductCard
                  key={`product_${index}`}
                  mode={mode}
                  deleteProduct={initiateDeleteProduct}
                  modifyProduct={initiateModifyProduct}
                  buyProduct={initiateViewProduct}
                  {...element}
                />
              </div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body1">No products available.</Typography>
            </div>
          </Grid>
        )}
      </Grid>
      {deleteModal && (
        <Modal
          open={deleteModal}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor:'white',padding:'20px', borderRadius: 2, boxShadow: 24, pt: 2, px: 4, pb: 3 }}>
            <h2 id="parent-modal-title">Confirm deletion of product!</h2>
            <p id="parent-modal-description">Are you sure you want to delete the product?</p>
            <Button onClick={handleClose} variant="outlined" style={{ float: 'right', marginLeft: 10 }}>
              Cancel
            </Button>
            <Button onClick={proceedDelete} variant="contained" style={{ float: 'right', marginLeft: 10 }}>
              Ok
            </Button>
          </Box>
        </Modal>
      )}
      <Backdrop style={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={busy}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    productList: state.metadata.products,
    sortBy: state.metadata.selectedSortBy,
    category: state.metadata.selectedCategory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reFetchAllData: () => dispatch(initCatalog()), // Assuming reFetchAllData doesn't require accessToken
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListing);
