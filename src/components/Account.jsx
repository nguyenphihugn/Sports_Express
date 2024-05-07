import { AuthData } from "../context/UserContext";

export const Account = () => {
  const { user } = AuthData();

  return (
    <div className="container-fluid mt-5">
      <h2>Your Account</h2>
      <p>Username: {user.name}</p>
    </div>
  );
};
