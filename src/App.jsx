import React from "react";
import { UserProvider } from "./context/UserContext";

import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <UserProvider />
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
