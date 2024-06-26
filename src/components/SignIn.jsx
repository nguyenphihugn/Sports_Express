import React, { useState, useReducer, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../context/UserContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, errorMes } = AuthData();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { username: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // console.log(errorMes);
    if (errorMes === "wrong")
      setErrorMessage("Wrong Username or Password, Please try again!");
  }, [errorMes]);

  const submitSignIn = async () => {
    try {
      await login(formData.username, formData.password);
      navigate("/home");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      submitSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container py-5 vh-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-lg-9 col-xl-7">
          <div
            className="card shadow-2-strong shadow p-3 mb-5 bg-body rounded"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4 p-md-5">
              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">
                Login to your account
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control "
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    maxLength="16"
                    onChange={(e) => setFormData({ username: e.target.value })}
                    required
                  />
                  <label>Username</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control "
                    type="password"
                    placeholder="Enter your password"
                    minLength="3"
                    maxLength="32"
                    value={formData.password}
                    onChange={(e) => setFormData({ password: e.target.value })}
                    required
                  />
                  <label>Password</label>
                </div>
                {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
                <br />
                <button
                  className="btn btn-outline-primary btn-lg"
                  type="submit"
                >
                  Login Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
