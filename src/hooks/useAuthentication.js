import { createContext, useState, useMemo } from "react";
import { doLogin } from "../api/userAuthAPIs";
import { setAxios } from "../common/Axios";
import { auth_localstorage } from '../common';

const AuthCtx = createContext();

const useAuthentication = () => {
  const initialState = JSON.parse(localStorage.getItem(auth_localstorage)) || {
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
    localStorage.setItem(auth_localstorage, JSON.stringify(updatedState));
  };

  const removeFromLocalStorage = () => {
    localStorage.removeItem(auth_localstorage);
  };

  const setToken = (accessToken) => {
    setAccessToken(accessToken);
    localStorage.setItem('token',accessToken);
    setAxios();
  }

  const loginUser = async (email, password) => {
    try {
      const json = await doLogin(email, password);
      saveToLocalStorage(json);
      setLoggedInUser(json.username);
      setLoggedInUserId(json.userId);
      setRoles(json.roles);
      setToken(json.accessToken);
      setAccessTokenTimeout(json.accessTokenTimeout);
      setLoginError(null);
      return json;
    } catch (error) {
      removeFromLocalStorage();
      setLoggedInUser(null);
      setLoggedInUserId(null);
      setRoles(null);
      setToken(null);
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
    setToken(null);
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
