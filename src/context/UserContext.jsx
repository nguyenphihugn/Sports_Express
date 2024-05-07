import React, { createContext, useEffect, useState, useContext } from "react";
import { RenderMenu, RenderRoutes } from "../structure/RenderNavigation";

export const UserContext = createContext();

export const AuthData = () => useContext(UserContext);

export const UserProvider = () => {
  const [token, setToken] = useState(localStorage.getItem("UserToken"));

  const [user, setUser] = useState({ name: "", isAuthenticated: false });

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("/api/users/me", requestOptions);

      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("UserToken", token);
    };
    fetchUser();
  }, [token]);

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
      setToken(data.access_token);
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
      setToken(data.access_token);
      setUser({ name: username, isAuthenticated: true });
    }
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, signup, token }}>
      <RenderMenu />
      <RenderRoutes />
    </UserContext.Provider>
  );
};
