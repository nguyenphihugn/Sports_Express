import { Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { AuthData } from "../context/UserContext";
import { nav } from "./navigation";
import { useState, useEffect } from "react";

export const RenderRoutes = () => {
  const { user } = AuthData();
  const [token2, setToken2] = useState(localStorage.getItem("UserToken"));
  // console.log(token2);
  const navigate = useNavigate();
  useEffect(() => {
    if (token2 !== "" && token2 !== null) {
      // navigate("/home");
    } else {
      navigate("/");
    }
    setToken2(localStorage.getItem("UserToken"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token2]);
  const requireAuth = (nextState, replace, next) => {
    if (!token2) {
      replace({
        pathname: "/",
        state: { nextPathname: nextState.location.pathname },
      }).next();
    }
    next();
  };
  return (
    <Routes>
      {nav.map((r, i) => {
        if (
          r.isPrivate &&
          (user.isAuthenticated || (token2 !== "" && token2 !== null))
        ) {
          return (
            <Route
              key={i}
              path={r.path}
              element={r.element}
              onEnter={requireAuth}
            />
          );
        } else if (!r.isPrivate) {
          return (
            <Route
              key={i}
              path={r.path}
              element={r.element}
              onEnter={requireAuth}
            />
          );
        } else return false;
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const RenderMenu = () => {
  const { user, logout } = AuthData();
  const token2 = localStorage.getItem("UserToken");
  const MenuItem = ({ r }) => {
    return (
      <div className="nav-item">
        <Link className="nav-link" to={r.path}>
          {r.name}
        </Link>
      </div>
    );
  };
  return (
    <nav className="navbar navbar-expand-lg bg-info" data-bs-theme="dark">
      <div className="container-fluid">
        <div className="navbar-brand">SPORTS EXPRESS</div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse collapse" id="navbarColor01" style={{}}>
          <div className="navbar-nav me-auto">
            {nav.map((r, i) => {
              if (!r.isPrivate && r.isMenu) {
                return <MenuItem key={i} r={r} />;
              } else if (
                (user.isAuthenticated || (token2 !== "" && token2 !== null)) &&
                r.isMenu
              ) {
                return <MenuItem key={i} r={r} />;
              } else return false;
            })}

            {user.isAuthenticated || (token2 !== "" && token2 !== null) ? (
              <div className="nav-item">
                <Link className="nav-link" to={"/"} onClick={logout}>
                  Log out
                </Link>
              </div>
            ) : (
              <div className="nav-item dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Account
                </div>
                <div className="dropdown-menu">
                  <Link className="dropdown-item" to={"/"}>
                    Sign In
                  </Link>
                  <Link className="dropdown-item" to={"signup"}>
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
          {user.isAuthenticated || (token2 !== "" && token2 !== null) ? (
            <div className="d-flex flex-column align-items-center">
              <img
                className="img-fluid rounded-circle"
                src="https://i.pravatar.cc/80"
                style={{ width: "55px", height: "55px" }}
                alt="Some Thing"
              />
              <a href="https://i.pravatar.cc/80">
                <div className="mask rgba-white-slight"></div>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
