import React, { useState, useContext, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { Navigate } from 'react-router-dom';
import useAuthentication from '../../hooks/useAuthentication';
import { useNavigate, useLocation } from 'react-router-dom';
import useServices from '../../hooks/useServices';

const Login = () => {
  let initialState = {
    username: {
      value: '',
      error: false,
      errorMessage: null,
    },
    password: {
      value: '',
      error: false,
      errorMessage: 'Please enter a valid password.',
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [busy, setBusy] = useState(false);
  const { AuthCtx } = useAuthentication();
  const { loginUser, loggedInUser } = useContext(AuthCtx);
  const history = useNavigate();
  const location = useLocation();
  const { from } = (location && location.state) || { from: { pathname: '/home' } };
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = useContext(ServicesCtx);

  useEffect(() => {
    loggedInUser && history(from, { replace: true });
  }, [loggedInUser, from, history]);

  const validateAndLoginData = () => {
    setBusy(true);
    let data = { ...formData };
    let requestJson = {};
    let validDetails = true;

    for (let k in formData) {
      let json = getValidity(k, formData[k].value);
      data[k] = {
        value: data[k].value,
        error: !json.valid,
        errorMessage: json.message,
      };
      validDetails = validDetails && json.valid;
      if (json.valid) {
        requestJson[k] = data[k].value;
      }
    }

    setFormData(data);

    if (validDetails) {
      loginUser(requestJson.username, requestJson.password)
        .then(() => {
          broadcastMessage('Login successful', 'success');
          setBusy(false);
        })
        .catch((json) => {
          broadcastMessage(json.reason, 'error');
          setBusy(false);
        });
    } else {
      setBusy(false);
    }
  };

  const matchRegex = (value, re) => {
    let regex = new RegExp(re);
    return regex.test(value);
  };

  const getValidity = (field, value) => {
    let valid = true;
    let message = null;

    if (value == null || value.length === 0) {
      valid = false;
      message = 'This field is required.';
    } else {
      switch (field) {
        case 'username': {
          if (value.length > 255) {
            valid = false;
            message = 'Email can be of length 255 characters';
          } else {
            // valid = matchRegex(value, '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
            message = valid ? null : 'Please enter a valid email.';
          }
          break;
        }
        case 'password': {
          if (value.length < 6 || value.length > 40) {
            valid = false;
            message = "Password's length must be between 6 and 40.";
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

  const validateAndSaveLoginData = (fieldName, fieldValue) => {
    let json = getValidity(fieldName, fieldValue);
    let data = { ...formData };

    data[fieldName] = {
      value: data[fieldName].value,
      error: !json.valid,
      errorMessage: json.message,
    };

    setFormData(data);
  };

  const saveOnFieldChange = (field, value) => {
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
                  Sign in
                </Typography>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <TextField
                  id="username"
                  label="Email Address *"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={formData.username.value}
                  onChange={(event) => saveOnFieldChange('username', event.target.value)}
                  onBlur={(event) => validateAndSaveLoginData('username', event.target.value)}
                  error={formData.username.error}
                  helperText={formData.username.error && formData.username.errorMessage}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <TextField
                  id="password"
                  label="Password *"
                  variant="outlined"
                  fullWidth
                  type="password"
                  value={formData.password.value}
                  onChange={(event) => saveOnFieldChange('password', event.target.value)}
                  onBlur={(event) => validateAndSaveLoginData('password', event.target.value)}
                  error={formData.password.error}
                  helperText={formData.password.error && formData.password.errorMessage}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={validateAndLoginData}
                >
                  SIGN IN
                </Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'left', marginTop: '30px' }}>
                <Link to="/signup">
                  <Typography variant="body1">Don't have an account? Sign Up</Typography>
                </Link>
              </div>
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </Grid>
        <Backdrop
          style={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={busy}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    );
  } else {
    return <Navigate to="/home" />;
  }
};

export default Login;
