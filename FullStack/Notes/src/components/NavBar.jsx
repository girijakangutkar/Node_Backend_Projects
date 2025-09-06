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
    <nav className="flex fixed top-0 justify-between p-4 bg-gray-200 w-full">
      <div className="flex gap-4">
        <Link to="/" className="font-bold text-md">
          Home
        </Link>
        <Link to="/myNotes" className="font-bold text-md">
          MyNotes
        </Link>
      </div>
      <div>
        {authenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-1.5 py-1.5 rounded text-sm font-semibold"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4 font-semibold">
              Login
            </Link>
            <Link to="/signup" className="font-semibold">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
