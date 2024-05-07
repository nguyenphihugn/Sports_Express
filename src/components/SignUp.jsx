import React, { useState, useReducer } from "react";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../context/UserContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = AuthData();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { username: "", email: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState("");

  const submitSignUp = async () => {
    try {
      await signup(formData.username, formData.password, formData.email);
      navigate("/");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === confirmPassword) {
      submitSignUp();
    } else {
      setErrorMessage(
        "Your confirm password is not correct with your password"
      );
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
              <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Create an account</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ email: e.target.value })}
                    required
                  />
                  <label>Email address</label>
                </div>
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
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter your password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength="3"
                    maxLength="32"
                    required
                  />
                  <label>Confirm Password</label>
                </div>
                {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
                <br />
                <button
                  className="btn btn-outline-primary btn-lg"
                  type="submit"
                >
                  Create account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
