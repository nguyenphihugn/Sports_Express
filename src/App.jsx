import React, { useState, useEffect, useContext } from "react";

import SignUp from "./components/SignUp";
import Header from "./components/Header";
import { UserContext } from "./context/UserContext";
import SignIn from "./components/SignIn";

const App = () => {
  const [message, setMessage] = useState("");
  const [token] = useContext(UserContext);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("Something went wrong!");
    } else {
      setMessage(data.message);
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  return (
    <React.Fragment>
      {!token ? (
        <div className="columns">
          <SignUp /> <SignIn />
        </div>
      ) : (
        <div>
          <Header title={message} />
          <p> Welcome Home</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default App;
