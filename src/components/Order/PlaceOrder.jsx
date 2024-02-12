import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Button, Grid, Step, StepLabel, Stepper, Snackbar } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import useAuthentication from '../../hooks/useAuthentication';
import useServices from '../../hooks/useServices';
import ItemDetail from '../Product/ItemDetail';
import Address from './Address';
import OrderDetails from './OrderDetails';
import { createOrder } from '../../api/orderAPIs';
import { ADMIN, USER } from '../../common';

const PlaceOrder = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [showMessageLevel, setShowMessageLevel] = useState('error');
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);
  const [activeStep, setActiveStep] = useState(0);
  const { AuthCtx } = useAuthentication();
  const { loggedInUserId, accessToken, isAccessTokenValid, logoutUser, hasUserRole } = useContext(AuthCtx);
  const navigate = useNavigate();
  const location = useLocation();
  const json = location.state ? JSON.parse(location.state) : null;

  const initPageData = useCallback((data = json) => {
    if (data === null || !hasUserRole([USER,ADMIN])) {
      broadcastMessage('Invalid access. Redirecting to home...', 'warning');
      navigate('/home');
    }
  }, [json, navigate, broadcastMessage]);

  useEffect(() => {
    initPageData();
  }, [initPageData]);

  const [orderDetails, setOrderDetails] = useState({
    quantity: json?.quantity || null,
    user: loggedInUserId,
    product: json?.product?.id || null,
    address: null,
    addressObject: null,
  });

  const stepperArray = [
    { labelOrder: 1, label: 'Items', completed: false },
    { labelOrder: 2, label: 'Select Address', completed: false },
    { labelOrder: 3, label: 'Confirm Order', completed: false },
  ];

  const [stepsForOrdering, setStepsForOrdering] = useState(stepperArray);

  const hideAndResetMessage = () => {
    setShowInfo(false);
    setShowMessage('');
    setShowMessageLevel('error');
  };

  const saveAddressForDelivery = (obj) => {
    setOrderDetails({
      ...orderDetails,
      address: obj ? obj.id : null,
      addressObject: obj,
    });
  };

  const moveToPreviousStep = () => {
    if (activeStep === 0) {
      navigate('/product/view', { state: JSON.stringify({ value: json.product }) });
    } else {
      const arr = stepsForOrdering.map((step, index) => ({
        ...step,
        completed: index === activeStep - 1,
      }));
      setStepsForOrdering(arr);
      setActiveStep(activeStep - 1);
    }
  };

  const validateAndMoveToNextStep = () => {
    let moveToNext = true;
    if (activeStep === 1) {
      if (orderDetails.address === undefined || orderDetails.address === null) {
        setShowInfo(true);
        setShowMessage('Please select address!');
        setShowMessageLevel('error');
        moveToNext = false;
      }
    }
    if (moveToNext) {
      const arr = stepsForOrdering.map((step, index) => ({
        ...step,
        completed: index === activeStep,
      }));
      setStepsForOrdering(arr);
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(activeStep);
    }
  };

  const confirmAndPlaceOrder = () => {
    if (isAccessTokenValid()) {
      createOrder(orderDetails, accessToken)
        .then(() => {
          broadcastMessage('Order placed successfully!', 'success');
          navigate('/home');
        })
        .catch((json) => {
          broadcastMessage(json.reason, 'error');
        });
    } else {
      broadcastMessage('Session expired. Please login again!', 'info');
      logoutUser().then(() => {
        navigate('/login');
      });
    }
  };

  return (
    <Box style={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stepper activeStep={activeStep} style={{ width: '80%' }}>
              {stepsForOrdering.map((element, index) => (
                <Step
                  key={`step_${index}`}
                  active={index === activeStep}
                  index={index}
                  last={index === 2}
                  completed={element.completed}
                >
                  <StepLabel>{element.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </Grid>
        {activeStep === 0 && (
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ItemDetail
                productQuantity={orderDetails.quantity}
                selectedProduct={json.product}
              />
            </div>
          </Grid>
        )}
        {activeStep === 1 && (
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Address
                callbackFunction={saveAddressForDelivery}
                address={orderDetails.addressObject}
              />
            </div>
          </Grid>
        )}
        {activeStep === 2 && (
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <OrderDetails
                quantity={orderDetails.quantity}
                product={json.product}
                address={orderDetails.addressObject}
              />
            </div>
          </Grid>
        )}
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="text" color="disabled" onClick={moveToPreviousStep}>
              BACK
            </Button>
            {(activeStep === 0 || activeStep === 1) && (
              <Button
                variant="contained"
                color="primary"
                onClick={validateAndMoveToNextStep}
                style={{}}
              >
                NEXT
              </Button>
            )}
            {activeStep === 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={confirmAndPlaceOrder}
              >
                PLACE ORDER
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={showInfo}
        autoHideDuration={4000}
        onClose={hideAndResetMessage}
      >
        <Alert onClose={hideAndResetMessage} severity={showMessageLevel} style={{ width: '100%' }}>
          {showMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlaceOrder;
