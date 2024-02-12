import { createContext, useState, useMemo } from "react";
import { doLogin } from "../api/userAuthAPIs";

const AuthCtx = createContext();

const useAuthentication = () => {
  const initialState = JSON.parse(localStorage.getItem("eshop_project")) || {
    user: null,
    userId: null,
    roles: null,
    accessToken: null,
    accessTokenTimeout: null,
  };

  const [loggedInUser, setLoggedInUser] = useState(initialState.user);
  const [loggedInUserId, setLoggedInUserId] = useState(initialState.userId);
  const [roles, setRoles] = useState(initialState.roles);
  const [accessToken, setAccessToken] = useState(initialState.accessToken);
  const [accessTokenTimeout, setAccessTokenTimeout] = useState(initialState.accessTokenTimeout);
  const [loginError, setLoginError] = useState(null);

  const saveToLocalStorage = (json) => {
    const updatedState = {
      user: json.username,
      userId: json.userId,
      roles: json.roles,
      accessToken: json.accessToken,
      accessTokenTimeout: json.accessTokenTimeout,
    };
    localStorage.setItem("eshop_project", JSON.stringify(updatedState));
  };

  const removeFromLocalStorage = () => {
    localStorage.removeItem("eshop_project");
  };

  const loginUser = async (email, password) => {
    try {
      const json = await doLogin(email, password);
      saveToLocalStorage(json);
      setLoggedInUser(json.username);
      setLoggedInUserId(json.userId);
      setRoles(json.roles);
      setAccessToken(json.accessToken);
      setAccessTokenTimeout(json.accessTokenTimeout);
      setLoginError(null);
      return json;
    } catch (error) {
      removeFromLocalStorage();
      setLoggedInUser(null);
      setLoggedInUserId(null);
      setRoles(null);
      setAccessToken(null);
      setAccessTokenTimeout(null);
      setLoginError(error.reason);
      throw error;
    }
  };

  const logoutUser = () => {
    removeFromLocalStorage();
    setLoggedInUser(null);
    setLoggedInUserId(null);
    setRoles(null);
    setAccessToken(null);
    setAccessTokenTimeout(null);
    setLoginError(null);
    return Promise.resolve();
  };

  const hasUserRole = (roleArray = []) => {
	if (!roles || !Array.isArray(roles)) {
	  return false;
	}
  
	return roleArray.some((role) => roles.includes(role));
  };

  const hasRole = (roleArray) => {
    if (!roles) {
      return true;
    }

    return roleArray.some((role) => roles.includes(role));
  };

  const isAccessTokenValid = () => !accessTokenTimeout || accessTokenTimeout >= Date.now();
  
  
  const contextValue = useMemo(() => ({
    loginError,
    loggedInUser,
    loggedInUserId,
    accessToken,
    accessTokenTimeout,
    roles,
    loginUser,
    logoutUser,
    hasUserRole,
    isAccessTokenValid,
  }), [loginError, loggedInUser, loggedInUserId, accessToken, accessTokenTimeout, roles]);

  return {
    AuthCtx,
    AuthProvider: ({ children }) => (
      <AuthCtx.Provider value={contextValue}>
        {children}
      </AuthCtx.Provider>
    ),
  };
};

export default useAuthentication;
