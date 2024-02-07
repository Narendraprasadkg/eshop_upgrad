// src/components/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, IconButton } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

const LoginPage = () => {
  const navigate = useNavigate();

  // State for managing form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for managing form validation errors
  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Perform form validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with login logic
      // For now, let's just log a message
      console.log("Login successful!");

      // Example of programmatic navigation after successful login
      navigate("/"); // Change the path to the desired route
    } else {
      // Update the state with validation errors
      setErrors(validationErrors);
    }
  };

  // Function to validate form inputs
  const validateForm = () => {
    const errors = {};

    // Validate required fields
    if (!email) {
      errors.email = "Email Address is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  return (
    <div className="login-body">
		<div className="login_form-container">
			<div className="">
				<div className="round-icon"> 
					<LockIcon style={{ marginRight: '5px', fontSize: 30 }}/> 
				</div>
				<h2>Sign In</h2>
			</div>
			<div>
				<form onSubmit={handleLogin}>
					<div>
						<TextField
							label="Username"
							variant="outlined"
							margin="normal"
							fullWidth
						/>
						<TextField
							label="Password"
							type="password"
							variant="outlined"
							margin="normal"
							fullWidth
						/>
						<Button
							className="login__button"
							variant="contained"
							color="primary"
							onClick={handleLogin}
							fullWidth
						>
							SIGN IN
						</Button>
					</div>
				</form>
				<p>
					Don't have an account? <a href="/signup">Sign up</a>
				</p>
				<p style={{ textAlign:'center',padding:'50px' }}>
					Copyright ⓒ <a href="/signup">UpGrade</a> 2021
				</p>
			</div>
		</div>
	</div>
  );
};

export default LoginPage;
