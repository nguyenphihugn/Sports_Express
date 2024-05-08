import { Account } from "../components/Account";
import { Home } from "../components/Home";
// import { Navigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

// const token = localStorage.getItem("UserToken");

export const nav = [
  {
    path: "/home",
    name: "Home",
    // element: token ? <Navigate to="/" /> : <Home />,
    element: <Home />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/account",
    name: "Account",
    element: <Account />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/",
    name: "Signin",
    element: <SignIn />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/signup",
    name: "SignUp",
    element: <SignUp />,
    isMenu: false,
    isPrivate: false,
  },
];
