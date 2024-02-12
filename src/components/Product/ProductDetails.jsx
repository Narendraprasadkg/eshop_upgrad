import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import ProductCategory from '../Common/ProductCategory';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Badge, Card, CardContent, CardMedia, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useServices from '../../hooks/useServices';
import Product from '../../common/Product';
import FlashOnIcon from '@material-ui/icons/FlashOn';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  shape: {
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
  },
  shapeCircle: {
    borderRadius: '50%',
  },
}));

const ProductDetails = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    count: {
      value: '1',
      error: false,
      errorMessage: null,
    },
  });
  const theme = useTheme();
  const isMdMatch = useMediaQuery(theme.breakpoints.down("md"));
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);
  const navigate = useNavigate();
  const location = useLocation();
  let metadata = location.state;

  if (metadata === null || metadata === undefined) {
    metadata = null;
  } else {
    metadata = JSON.parse(metadata).value;
    if (
      metadata === null ||
      metadata === undefined ||
      metadata['id'] === undefined ||
      metadata.id === null
    ) {
      metadata = null;
    }
  }

  let productDetails = new Product(metadata);

  const initPageData = useCallback(
    (data = metadata, redirect = navigate, showMessage = broadcastMessage) => {
      if (data === null) {
        showMessage('Invalid access. Redirecting to home...', 'warning');
        redirect('/home');
      }
    },
    [metadata, navigate, broadcastMessage]
  );

  useEffect(() => {
    initPageData();
  }, [initPageData]);

  let saveOnChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        value,
      },
    });
  };

  let matchRegex = (value, re) => {
    let regex = new RegExp(re);
    return regex.test(value);
  };

  let getValidity = (field, value) => {
    let valid = true;
    let message = null;
    if (value == null || value.length === 0) {
      valid = false;
      message = 'This field is required.';
    } else {
      switch (field) {
        case 'count': {
          valid = matchRegex(value, '^([1-9]{1}[0-9]{0,8})$');
          message = 'Please enter valid number.';
          if (valid) {
            if (parseInt(value) > productDetails.availableItems) {
              valid = false;
              message = `Quantity must be less than ${productDetails.availableItems}.`;
            }
          }
          break;
        }
        default: {
          return;
        }
      }
    }
    return {
      valid,
      message,
    };
  };

  let validateAndSave = (field, value) => {
    let productDetails = getValidity(field, value);
    let data = {
      ...formData,
    };
    data[field] = {
      value: data[field].value,
      error: !productDetails.valid,
      errorMessage: productDetails.message,
    };
    setFormData(data);
  };

  let placeOrder = () => {
    navigate('/product/order', {
      state: JSON.stringify({
        product: productDetails,
        quantity: formData.count.value,
      }),
    });
  };

  return (
    <Box style={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ProductCategory />
            </div>
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100%' }}>
            {isMdMatch ? (
              <Grid item>
                <Grid container>
                  <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2%' }}>
                      <Card style={{ width: '450px' }}>
                        <CardMedia style={{ height: 200 }} image={productDetails.imageUrl} title={productDetails.name} />
                        <CardContent>
                          <Grid container>
                            <Grid item xs={9}>
                              <div style={{ display: 'flex', justifyContent: 'left' }}>
                                <Typography gutterBottom variant="h6" component="div">
                                  {productDetails.name}
                                </Typography>
                                <Badge color="secondary" overlap="circular" badgeContent={productDetails.availableItems}>
                                  <div style={{width:'50px',height:'50px',borderRadius:'50%', backgroundColor:'#3f51b5', display:'flex', justifyContent:'center', alignItems:'center'}} >
                                    <FlashOnIcon />
                                  </div>
                                </Badge>
                                <div style={{ paddingLeft: '5px' }}>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={3}>
                              <div style={{ display: 'flex', justifyContent: 'right' }}>
                                <Typography
                                  gutterBottom
                                  variant="h6"
                                  component="div"
                                  style={{
                                    color: theme.palette.secondary.main,
                                  }}
                                >
                                  {`₹ ${productDetails.price}`}
                                </Typography>
                              </div>
                            </Grid>
                          </Grid>
                          <Typography variant="body2" color="text.secondary" style={{ height: 80 }}>
                            {productDetails.description}
                          </Typography>
                          <div style={{ display: 'flex', justifyContent: 'left', paddingTop: '4%' }}>
                            <TextField
                              id="count"
                              label="Enter Quantity *"
                              variant="outlined"
                              fullWidth
                              value={formData.count.value}
                              onChange={(event) => saveOnChange('count', event.target.value)}
                              onBlur={(event) => validateAndSave('count', event.target.value)}
                              error={formData.count.error}
                              helperText={formData.count.error && formData.count.errorMessage}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'left', paddingTop: '4%' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => placeOrder()}
                            >
                              PLACE ORDER
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid item>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '5% 20% 0% 20%',
                  }}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <img
                        style={{
                          maxWidth: '400px',
                        }}
                        src={productDetails.imageUrl}
                        alt={`Image of ${productDetails.name}`}
                      />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={7}>
                      <Grid container>
                        <Grid item xs={12}>
                          <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <Typography variant={'h4'}>{productDetails.name}</Typography>
                            <div style={{ paddingLeft: '4%' }}>
                              <Typography
                                variant={'body1'}
                                style={{
                                  color: '#FFFFFF',
                                  backgroundColor: theme.palette.primary.main,
                                  padding: '2px 10px 2px 10px',
                                  marginTop: '5px',
                                  borderRadius: 20,
                                  width:'200px'
                                }}
                              >
                                {`Available Quantity : ${productDetails.availableItems}`}
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <Typography variant={'body1'} style={{ paddingTop: '2%' }}>
                              {`Category: `}
                              <b>{productDetails.category}</b>
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <Typography variant={'body1'} style={{ paddingTop: '4%' }}>
                              {productDetails.description}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <div style={{ display: 'flex', justifyContent: 'left' }}>
                            <Typography
                              variant={'h5'}
                              style={{
                                color: theme.palette.secondary.main,
                                paddingTop: '4%',
                              }}
                            >
                              {`₹ ${productDetails.price}`}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'left',
                              paddingTop: '4%',
                              width: '50%',
                            }}
                          >
                            <TextField
                              id="count"
                              label="Enter Quantity *"
                              variant="outlined"
                              fullWidth
                              value={formData.count.value}
                              onChange={(event) => saveOnChange('count', event.target.value)}
                              onBlur={(event) => validateAndSave('count', event.target.value)}
                              error={formData.count.error}
                              helperText={formData.count.error && formData.count.errorMessage}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'left',
                              paddingTop: '4%',
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => placeOrder()}
                            >
                              PLACE ORDER
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
