import { AuthData } from "../context/UserContext";

export const Account = () => {
  const { user } = AuthData();

  return (
    <div className="container-fluid mt-5">
      <h2>Add User</h2>
      <p>Username: {user.name}</p>
    </div>
  );
};
