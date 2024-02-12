import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useNavigate, useLocation } from 'react-router-dom';
import CreatableSelect from '../Common/CreatableSelect';
import { initCatalog } from '../../store/actions/metadataAction';
import useAuthentication from '../../hooks/useAuthentication';
import useServices from '../../hooks/useServices';
import Product from '../../common/Product';
import { MODIFY } from "../../common";

const ProductUpdatePage = ({ categories, mode, headingText, buttonText, callbackFunction, jsonData, reFetchAllData }) => {
  const [busy, setBusy] = useState(false);
  const { ServicesCtx } = useServices();
  const { broadcastMessage } = React.useContext(ServicesCtx);
  const { AuthCtx } = useAuthentication();
  const { accessToken, isAccessTokenValid, logoutUser } = React.useContext(AuthCtx);
  const navigate = useNavigate();
  const location = useLocation();
  let json = typeof(location.state) === 'string' ? JSON.parse(location.state) : location.state;

  if(mode === MODIFY && json && json.value && json.value.id){
    jsonData = new Product(json.value);
  }else{
    jsonData = new Product(jsonData);
  }

  const initPageData = useCallback(() => {
    if (!mode || (mode === MODIFY && !jsonData.id)) {
      broadcastMessage('Invalid access. Redirecting to home...', 'warning');
      navigate('/home');
    }
  }, [mode, jsonData, navigate, broadcastMessage]);

  useEffect(() => {
    initPageData();
  }, [initPageData]);

  const [formData, setFormData] = useState({
    name: { value: jsonData.name, error: false, errorMessage: null },
    category: { value: jsonData.category, error: false, errorMessage: null },
    manufacturer: { value: jsonData.manufacturer, error: false, errorMessage: null },
    availableItems: { value: jsonData.availableItems, error: false, errorMessage: null },
    price: { value: jsonData.price, error: false, errorMessage: null },
    imageUrl: { value: jsonData.imageUrl, error: false, errorMessage: null },
    description: { value: jsonData.description, error: false, errorMessage: null },
  });

  const validateData = () => {
    setBusy(true);
    let data = { ...formData };
    let requestJson = {};
    if (jsonData.id) {
      requestJson.id = jsonData.id;
    }
    let valid = true;
    for (let k in formData) {
      let json = getValidity(k, formData[k].value);
      data[k] = { value: data[k].value, error: !json.valid, errorMessage: json.message };
      valid = valid && json.valid;
      if (json.valid) {
        requestJson[k] = data[k].value;
      }
    }
    setFormData(data);
    if (valid) {
      if (isAccessTokenValid()) {
        callbackFunction(requestJson, accessToken)
          .then((json) => {
            broadcastMessage(json.message, 'success');
            setBusy(false);
            reFetchAllData(accessToken);
            navigate('/home');
          })
          .catch((json) => {
            broadcastMessage(json.reason, 'error');
            setBusy(false);
          });
      } else {
        broadcastMessage('Session expired. Please login again!', 'info');
        logoutUser().then(() => {
          navigate('/login');
        });
      }
    } else {
      setBusy(false);
    }
  };

  const matchRegex = (value, re) => new RegExp(re).test(value);

  const getValidity = (field, value) => {
    let valid = true;
    let message = null;
    if (!value || value.length === 0) {
      if (field !== 'imageUrl' && field !== 'description') {
        valid = false;
        message = 'This field is required.';
      }
    } else {
      switch (field) {
        case 'name': {
          if (value.length > 255) {
            valid = false;
            message = 'Product name can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z\\s]+)$');
            message = 'Please enter a valid product name.';
          }
          break;
        }
        case 'category': {
          if (value.length > 255) {
            valid = false;
            message = 'Category can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z-\\s]+)$');
            message = 'Please enter a valid category.';
          }
          break;
        }
        case 'manufacturer': {
          if (value.length > 255) {
            valid = false;
            message = 'Manufacturer can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z\\s]+)$');
            message = 'Please enter a valid manufacturer.';
          }
          break;
        }
        case 'availableItems': {
          valid = matchRegex(value, '^([1-9]{1}[0-9]{0,8})$');
          message = 'Please enter a valid number.';
          break;
        }
        case 'price': {
          valid = matchRegex(value, '^([1-9]{1}[0-9]{0,8})$');
          message = 'Please enter a valid amount.';
          break;
        }
        case 'imageUrl': {
          try {
            valid = Boolean(new URL(value));
            if (!valid) {
              message = 'Please enter a valid URL.';
            }
          } catch (e) {
            valid = false;
            message = 'Please enter a valid URL.';
          }
          break;
        }
        case 'description': {
          if (value.length > 255) {
            valid = false;
            message = 'Description can be of length 255 characters';
          } else {
            valid = matchRegex(value, '^([A-Za-z0-9_@%*.-\\s\\[\\]\\(\\),\']{1,255})$');
            message = 'Please enter a valid description.';
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

  const validateAndSave = (field, value) => {
    let json = getValidity(field, value);
    let data = { ...formData };
    data[field] = {
      value,
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

  const onChangeCallback = (value) => {
    validateAndSave('category', value);
  };

  return (
    <Box sx={{flexGrow: 1}}>
			<Grid container spacing={1}>
				<Grid container item spacing={3}>
					<Grid item xs={4}/>
					<Grid item xs={4}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Typography
								variant="subtitle1"
								noWrap
								sx={{
									fontSize: "25px",
									color: 'inherit',
								}}
							>
								{headingText}
							</Typography>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="productName"
								label="Name *"
								variant="outlined"
								fullWidth
								value={formData.name.value}
								onChange={(event) => saveOnChange("name", event.target.value)}
								onBlur={(event) => validateAndSave("name", event.target.value)}
								error={formData.name.error}
								helperText={formData.name.error && formData.name.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
              <CreatableSelect
                id="category"
                label="Category *"
                variant="outlined"
                fullWidth
                value={formData.category.value}
                onChange={(value) => saveOnChange('category', value)}
                onBlur={() => validateAndSave('category', formData.category.value)}
                error={formData.category.error}
                helperText={formData.category.error && formData.category.errorMessage}
                options={categories}/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="manufacturer"
								label="Manufacturer *"
								variant="outlined"
								fullWidth
								value={formData.manufacturer.value}
								onChange={(event) => saveOnChange("manufacturer", event.target.value)}
								onBlur={(event) => validateAndSave("manufacturer", event.target.value)}
								error={formData.manufacturer.error}
								helperText={formData.manufacturer.error && formData.manufacturer.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="availableItems"
								label="Available Items *"
								variant="outlined"
								fullWidth
								value={formData.availableItems.value}
								onChange={(event) => saveOnChange("availableItems", event.target.value)}
								onBlur={(event) => validateAndSave("availableItems", event.target.value)}
								error={formData.availableItems.error}
								helperText={formData.availableItems.error && formData.availableItems.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="price"
								label="Price *"
								variant="outlined"
								fullWidth
								value={formData.price.value}
								onChange={(event) => saveOnChange("price", event.target.value)}
								onBlur={(event) => validateAndSave("price", event.target.value)}
								error={formData.price.error}
								helperText={formData.price.error && formData.price.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="imageUrl"
								label="Image URL"
								variant="outlined"
								fullWidth
								value={formData.imageUrl.value}
								onChange={(event) => saveOnChange("imageUrl", event.target.value)}
								onBlur={(event) => validateAndSave("imageUrl", event.target.value)}
								error={formData.imageUrl.error}
								helperText={formData.imageUrl.error && formData.imageUrl.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="description"
								label="Product Description"
								variant="outlined"
								fullWidth
								value={formData.description.value}
								onChange={(event) => saveOnChange("description", event.target.value)}
								onBlur={(event) => validateAndSave("description", event.target.value)}
								error={formData.description.error}
								helperText={formData.description.error && formData.description.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<Button
								variant="contained"
								color="primary"
								fullWidth
								onClick={validateData}
							>
								{buttonText}
							</Button>
						</div>
					</Grid>
					<Grid item xs={4}/>
				</Grid>
			</Grid>
			<Backdrop
				sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
				open={busy}
			>
				<CircularProgress color="inherit"/>
			</Backdrop>
		</Box>
  );
};

const mapStateToProps = (state) => ({
  categories: state.metadata.categories,
});

const mapDispatchToProps = (dispatch) => ({
  reFetchAllData: (accessToken) => dispatch(initCatalog(accessToken)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductUpdatePage);
