import { Link, Route, Routes } from "react-router-dom";
import { AuthData } from "../context/UserContext";
import { nav } from "./navigation";

export const RenderRoutes = () => {
  const { user } = AuthData();

  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && user.isAuthenticated) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return false;
      })}
    </Routes>
  );
};

export const RenderMenu = () => {
  const { user, logout, token } = AuthData();

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
        <div class="navbar-brand">FASHION - BLOGS</div>
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
              } else if (user.isAuthenticated && r.isMenu) {
                return <MenuItem key={i} r={r} />;
              } else return false;
            })}

            {user.isAuthenticated || token ? (
              <div className="nav-item">
                <Link className="nav-link" to={"#"} onClick={logout}>
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
                  <Link className="dropdown-item" to={"signin"}>
                    Sign In
                  </Link>
                  <Link className="dropdown-item" to={"signup"}>
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
          <form className="d-flex" data-bs-theme="light">
            <input
              className="form-control me-sm-2"
              type="search"
              placeholder="Search"
            />
            <button
              class="btn btn-secondary my-2 my-sm-0 me-sm-5"
              type="submit"
            >
              Search
            </button>
          </form>
          {user.isAuthenticated || token ? (
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
