import React, { createContext, useState, useContext } from "react";
import { RenderMenu, RenderRoutes } from "../structure/RenderNavigation";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const AuthData = () => useContext(UserContext);

export const UserProvider = () => {
  const token2 = localStorage.getItem("UserToken");
  const navigate = useNavigate();
  // const history = useHistory();

  const [user, setUser] = useState({ name: "", isAuthenticated: false });

  const login = async (username, password) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(response);
    } else {
      localStorage.setItem("UserToken", data.access_token);
      setUser({ name: username, isAuthenticated: true });
    }
  };

  const signup = async (username, password, email) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    };
    const response = await fetch("/api/users", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log(response);
    } else {
      localStorage.setItem("UserToken", data.access_token);
      setUser({ name: username, isAuthenticated: true });
    }
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
    localStorage.setItem("UserToken", "");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup, token2 }}>
      <RenderMenu />
      <RenderRoutes />
    </UserContext.Provider>
  );
};
