import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import NavBar from "./components/NavBar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Main from "./Pages/MainNote";
import ReadIt from "./Pages/ReadIt";
import axios from "axios";

const App = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const baseUri = import.meta.env.VITE_BASE_URI || "http://localhost:3000";

  const handleReadBook = async (bookId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${baseUri}/app/readNote/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedBook(response.data.readNote);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
  };

  return (
    <div>
      <NavBar />
      {selectedBook && <ReadIt book={selectedBook} onClose={handleCloseBook} />}

      <Routes>
        <Route path="/" element={<Main onReadBook={handleReadBook} />} />
        <Route
          path="/myNotes"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
