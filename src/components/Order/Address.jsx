import React, { useCallback, useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { useNavigate } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import useAuthentication from '../../hooks/useAuthentication';
import { createAddress, fetchAllAddresses } from '../../api/addressAPIs';

const Address = ({ callbackFunction, address }) => {
  const initialState = {
    name: { value: '', error: false, errorMessage: null },
    contactNumber: { value: '', error: false, errorMessage: null },
    street: { value: '', error: false, errorMessage: null },
    city: { value: '', error: false, errorMessage: null },
    state: { value: '', error: false, errorMessage: null },
    landmark: { value: '', error: false, errorMessage: null },
    zipcode: { value: '', error: false, errorMessage: null },
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedAddress, setSelectedAddress] = useState(address?.id || '');
  const [busy, setBusy] = useState(false);
  const { AuthCtx } = useAuthentication();
  const { loggedInUserId, accessToken, isAccessTokenValid, logoutUser } = useContext(AuthCtx);
  const [addressList, setAddressList] = useState([]);
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [showMessageLevel, setShowMessageLevel] = useState('error');

  const hideAndResetMessage = () => {
    setShowInfo(false);
    setShowMessage('');
    setShowMessageLevel('error');
  };

  const validateAndPersistData = () => {
    setBusy(true);
    const data = { ...formData };
    const requestJson = { user: loggedInUserId };
    let validAddress = true;

    for (const k in formData) {
      const json = getValidity(k, formData[k].value);
      data[k] = {
        value: data[k].value,
        error: !json.valid,
        errorMessage: json.message,
      };
      validAddress = validAddress && json.valid;

      if (json.valid) {
        requestJson[k] = data[k].value;
      }
    }

    setFormData(data);

    if (validAddress) {
      if (isAccessTokenValid()) {
        createAddress(requestJson, accessToken)
          .then(() => {
            setShowInfo(true);
            setShowMessage('Address saved successfully.');
            setShowMessageLevel('success');
            setBusy(false);
            setFormData(initialState);
            initDropdown();
          })
          .catch((json) => {
            setShowInfo(true);
            setShowMessage(json.reason);
            setShowMessageLevel('error');
            setBusy(false);
          });
      } else {
        setShowInfo(true);
        setShowMessage('Session expired. Please login again!');
        setShowMessageLevel('info');
        logoutUser().then(() => {
          navigate('/login');
        });
      }
    } else {
      setBusy(false);
    }
  };

  const matchRegex = (value, re) => {
    const regex = new RegExp(re);
    return regex.test(value);
  };

  const getValidity = (field, value) => {
    let valid = true;
    let message = null;

    if (value == null || value.length === 0) {
      if (field !== 'landmark') {
        valid = false;
        message = 'This field is required.';
      }
    } else {
      switch (field) {
        case 'name': {
          if (value.length > 255) {
            valid = false;
            message = 'Name can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z\\s]+)$');
            message = 'Please enter valid name.';
          }
          break;
        }
        case 'contactNumber': {
          valid = matchRegex(value, '^([7-9]{1}[0-9]{9})$');
          message = 'Please enter valid contact number.';
          break;
        }
        case 'street': {
          if (value.length > 255) {
            valid = false;
            message = 'Street can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z0-9,/\\s\\-_@]+)$');
            message = 'Please enter valid street.';
          }
          break;
        }
        case 'city': {
          if (value.length > 255) {
            valid = false;
            message = 'City can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z]+)$');
            message = 'Please enter valid city.';
          }
          break;
        }
        case 'state': {
          if (value.length > 255) {
            valid = false;
            message = 'State can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z\\s]+)$');
            message = 'Please enter valid state.';
          }
          break;
        }
        case 'landmark': {
          if (value.length > 255) {
            valid = false;
            message = 'Landmark can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z0-9,/\\s\\-_@]+)$');
            message = 'Please enter valid landmark.';
          }
          break;
        }
        case 'zipcode': {
          valid = matchRegex(value, '^([1-9]{1}[0-9]{5})$');
          message = 'Please enter valid zip code.';
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

  const validateAndSave = (field, value) => {
    const json = getValidity(field, value);
    const data = { ...formData };
    data[field] = {
      value: data[field].value,
      error: !json.valid,
      errorMessage: json.message,
    };
    setFormData(data);
  };

  const saveOnChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        value,
      },
    });
  };

  const handleChange = (event) => {
    setSelectedAddress(event.target.value);
    const selected = addressList.find((element) => element.id === event.target.value);
    callbackFunction(selected || null);
  };

  const initDropdown = useCallback(() => {
    if (isAccessTokenValid()) {
      fetchAllAddresses(accessToken)
        .then((json) => {
          setAddressList(json.data);
        })
        .catch(() => {
          setAddressList([]);
        });
    } else {
      setShowInfo(true);
      setShowMessage('Session expired. Please login again!');
      setShowMessageLevel('info');
      logoutUser().then(() => {
        navigate('/login');
      });
    }
  }, [accessToken, isAccessTokenValid, navigate, logoutUser]);

  useEffect(() => {
    initDropdown();
  }, [initDropdown]);

  return (
    <Box style={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl style={{ m: 1, width: '60%' }}>
                <InputLabel id="demo-simple-select-label">Select Address</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedAddress}
                  label="Select Address"
                  onChange={handleChange}
                >
                  {(addressList === undefined || addressList === null || addressList.length === 0) && (
                    <MenuItem disabled value="">
                      No address saved
                    </MenuItem>
                  )}
                  {addressList &&
                    addressList.map((element, index) => (
                      <MenuItem key={`sortBy_${index}`} value={element.id}>
                        {`${element.name}, Contact Number: ${element.contactNumber}`}
                        <br />
                        {`${element.street}${element.landmark ? `, ${element.landmark}` : ''}`}
                        <br />
                        {`${element.city}, ${element.state}, ${element.zipcode}`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="subtitle1"
                noWrap
                style={{
                  fontSize: '15px',
                  color: 'inherit',
                }}
              >
                OR
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="subtitle1"
                noWrap
                style={{
                  fontSize: '25px',
                  color: 'inherit',
                }}
              >
                Add Address
              </Typography>
            </div>
            {Object.entries(formData).map(([field, fieldData]) => (
              <div key={field} style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <TextField
                  id={field}
                  label={`${field.charAt(0).toUpperCase()}${field.slice(1)} ${fieldData.error ? '*' : ''}`}
                  variant="outlined"
                  fullWidth
                  value={fieldData.value}
                  onChange={(event) => saveOnChange(field, event.target.value)}
                  onBlur={(event) => validateAndSave(field, event.target.value)}
                  error={fieldData.error}
                  helperText={fieldData.error && fieldData.errorMessage}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <Button variant="contained" color="primary" fullWidth onClick={validateAndPersistData}>
                SAVE ADDRESS
              </Button>
            </div>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Grid>
      <Backdrop style={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={busy}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={showInfo}
        autoHideDuration={4000}
        onClose={() => hideAndResetMessage()}
      >
        <Alert onClose={() => hideAndResetMessage()} severity={showMessageLevel} style={{ width: '100%' }}>
          {showMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Address;
