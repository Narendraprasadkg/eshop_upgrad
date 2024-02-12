import React, { useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, Navigate } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { doSignup } from '../../api/userAuthAPIs';
import useAuthentication from '../../hooks/useAuthentication';
import useServices from '../../hooks/useServices';
import Grid from '@material-ui/core/Grid'; // Add this line

const SignUp = () => {
  const initialState = {
    firstName: { value: '', error: false, errorMessage: null },
    lastName: { value: '', error: false, errorMessage: null },
    email: { value: '', error: false, errorMessage: null },
    password: { value: '', error: false, errorMessage: 'Please enter a valid password.' },
    confirmPassword: { value: '', error: false, errorMessage: null },
    contactNumber: { value: '', error: false, errorMessage: null },
  };

  const [formData, setFormData] = useState(initialState);
  const [busy, setBusy] = useState(false);
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);
  const { AuthCtx } = useAuthentication();
  const { loggedInUser } = useContext(AuthCtx);

  const validateData = () => {
    setBusy(true);
    let data = { ...formData };
    let requestJson = {};
    let valid = true;

    for (let field in formData) {
      let { valid: fieldValid, message } = getValidity(field, formData[field].value);
      data[field] = { value: data[field].value, error: !fieldValid, errorMessage: message };
      valid = valid && fieldValid;
      if (fieldValid) {
        requestJson[field] = data[field].value;
      }
    }

    setFormData(data);

    if (valid) {
      doSignup(requestJson)
        .then((json) => {
          broadcastMessage(json.message, 'success');
          setBusy(false);
          setFormData(initialState);
        })
        .catch((json) => {
          broadcastMessage(json.reason, 'error');
          setBusy(false);
        });
    } else {
      setBusy(false);
    }
  };

  const matchRegex = (value, regex) => new RegExp(regex).test(value);

  const getValidity = (field, value) => {
    let valid = true;
    let message = null;

    if (!value || value.length === 0) {
      valid = false;
      message = 'This field is required.';
    } else {
      switch (field) {
        case 'firstName':
        case 'lastName':
          valid = matchRegex(value, '^[A-Za-z]+$');
          message = `Please enter a valid ${field.toLowerCase()}.`;
          break;
        case 'email':
          valid = matchRegex(value, '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
          message = 'Please enter a valid email.';
          break;
        case 'password':
          valid = matchRegex(value, '^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,40}$');
          message = 'Password must contain at least a symbol (!@#$%^&*), upper and lower case letters, and a number.';
          break;
        case 'confirmPassword':
          valid = value.length > 0 && value === formData.password.value;
          message = 'Passwords do not match.';
          break;
        case 'contactNumber':
          valid = matchRegex(value, '^[7-9]{1}[0-9]{9}$');
          message = 'Please enter a valid contact number.';
          break;
        default:
          return;
      }
    }

    return { valid, message };
  };

  const validateAndSaveInMemory = (fieldName, value) => {
    const { valid, message } = getValidity(fieldName, value);
    const data = {
      ...formData,
      [fieldName]: {
        value: formData[fieldName].value,
        error: !valid,
        errorMessage: message,
      },
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

  if (!loggedInUser) {
    return (
      <Box style={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid container item spacing={3}>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%' }}>
                <LockOutlinedIcon
                  style={{
                    display: 'inline-block',
                    borderRadius: '60px',
                    padding: '0.6em 0.6em',
                    color: '#ffffff',
                    background: '#f50057',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="subtitle1" noWrap style={{ fontSize: '25px', color: 'inherit' }}>
                  Sign up
                </Typography>
              </div>
              {Object.entries(formData).map(([field, { value, error, errorMessage }]) => (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }} key={field}>
                  <TextField
                    id={field}
                    label={`${field.charAt(0).toUpperCase()}${field.slice(1)} *`}
                    variant="outlined"
                    fullWidth
                    type={field === 'email' ? 'email' : 'text'}
                    value={value}
                    onChange={(event) => saveOnChange(field, event.target.value)}
                    onBlur={(event) => validateAndSaveInMemory(field, event.target.value)}
                    error={error}
                    helperText={error && errorMessage}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <Button variant="contained" color="primary" fullWidth onClick={validateData}>
                  SIGN UP
                </Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'right', marginTop: '30px' }}>
                <Link to="/login">
                  <Typography variant="body1">Already have an account? Sign in</Typography>
                </Link>
              </div>
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </Grid>
        <Backdrop style={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={busy}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    );
  } else {
    return <Navigate to="/home" />;
  }
};

export default SignUp;
