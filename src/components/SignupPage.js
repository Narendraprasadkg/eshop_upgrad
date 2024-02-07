// src/components/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, IconButton } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

const SignupPage = () => {
  const navigate = useNavigate();

  // State for managing form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // State for managing form validation errors
  const [errors, setErrors] = useState({});

  // Function to handle form submission
  const handleSignup = (e) => {
    e.preventDefault();

    // Perform form validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with signup logic
      // For now, let's just log a message
      console.log("Signup successful!");

      // Example of programmatic navigation after successful signup
      navigate("/login"); // Change the path to the desired route
    } else {
      // Update the state with validation errors
      setErrors(validationErrors);
    }
  };

  // Function to validate form inputs
  const validateForm = () => {
    const errors = {};

    // Validate required fields
    if (!firstName) {
      errors.firstName = "First Name is required";
    }

    if (!lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!email) {
      errors.email = "Email Address is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!contactNumber) {
      errors.contactNumber = "Contact Number is required";
    }

    return errors;
  };

  return (
    <div className="signup-body">
		<div className="signup_form-container">
			<div >
				<div className="round-icon"> 
					<LockIcon style={{ marginRight: '5px', fontSize: 30 }}/> 
				</div>
				<h2>Sign Up</h2>
			</div>
			<form onSubmit={handleSignup}>
				<div>
				<TextField
					label="First Name"
					variant="outlined"
					margin="normal"
					fullWidth
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<TextField
					label="Last Name"
					variant="outlined"
					margin="normal"
					fullWidth
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				<TextField
					label="Email"
					variant="outlined"
					margin="normal"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextField
					label="Password"
					type="password"
					variant="outlined"
					margin="normal"
					fullWidth
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<TextField
					label="Confirm Password"
					type="password"
					variant="outlined"
					margin="normal"
					fullWidth
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<TextField
					label="Contact Number"
					variant="outlined"
					margin="normal"
					fullWidth
					value={contactNumber}
					onChange={(e) => setContactNumber(e.target.value)}
				/>
				<Button
					className="login__button"
					variant="contained"
					color="primary"
					onClick={handleSignup}
					fullWidth
				>
					SIGN UP
				</Button>
				</div>
			</form>
			<p>
				Already have an account? <a href="/login">Sign in</a>
			</p>
			<p style={{ textAlign:'center',padding:'50px' }}>
				Copyright ⓒ <a href="/signup">UpGrade</a> 2021
			</p>
		</div>
	</div>
  );
};

export default SignupPage;
