import { Account } from "../components/Add";
import { Home } from "../components/Home";
import { Navigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { Favorite } from "../components/Favorite";

const token = localStorage.getItem("UserToken");
// console.log(token);
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
    path: "/mark",
    name: "Favorite",
    // element: token ? <Navigate to="/" /> : <Home />,
    element: <Favorite />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/add",
    name: "Add Blog",
    element: <Account />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/",
    name: "Signin",
    // element: <SignIn />,
    element: token ? <Navigate to="/home" /> : <SignIn />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/signup",
    name: "SignUp",
    // element: <SignUp />,
    element: token ? <Navigate to="/home" /> : <SignUp />,
    isMenu: false,
    isPrivate: false,
  },
];
