import { Home } from "../components/Home";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export const nav = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
    isMenu: true,
    isPrivate: false,
  },
  {
    path: "/signin",
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
