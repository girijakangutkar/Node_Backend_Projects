import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-200">
      <Link to="/" className="font-bold text-xl">
        Notes Here
      </Link>
      <div>
        {authenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
