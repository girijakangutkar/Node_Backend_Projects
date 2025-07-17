import { LogIn, UserPlus, LogOut, NotebookTabs } from "lucide-react";
import React from "react";
import { Navigate, NavLink } from "react-router-dom";

const NavBar = () => {
  const token = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    Navigate("/login");
  };

  return (
    <div className="p-5 bg-green-200 flex flex-row justify-between g-10 px-10 font-bold">
      <div className="flex flex-row gap-3 justify-center items-center">
        <NotebookTabs size={20} />
        <nav>{token && <NavLink to="/">Home</NavLink>}</nav>
      </div>
      <nav>
        {token ? (
          <NavLink
            onClick={handleLogout}
            className="flex flex-row items-center gap-1 text-red-500"
          >
            <LogOut size={15} color="red" />
            Logout
          </NavLink>
        ) : (
          <div className="flex flex-row">
            <NavLink
              to="/login"
              className="flex flex-row items-center gap-1 mx-3 text-green-700"
            >
              <LogIn size={15} color="green" />
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="flex flex-row items-center gap-1 text-green-700"
            >
              <UserPlus size={15} color="green" />
              Signup
            </NavLink>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
