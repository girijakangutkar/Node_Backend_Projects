"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const MainNote = ({ onReadBook }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUri = import.meta.env.VITE_BASE_URI || "http://localhost:3000";

  const coverImages = [
    "/assets/7013.jpg",
    "/assets/6452302.jpg",
    "https://i.pinimg.com/736x/d3/8e/b5/d38eb5834df719c34ed334f9ab6d7fd7.jpg",
    "https://i.pinimg.com/736x/01/35/d1/0135d15b2857e7158d7b2401de802648.jpg",
    "https://i.pinimg.com/474x/7a/66/e9/7a66e967891cd913e4e6e267c73bb2ee.jpg",
    "https://i.pinimg.com/474x/06/e3/25/06e325c6150c10163b4e7b6d2a8261b9.jpg",
    "https://i.pinimg.com/474x/b8/7f/38/b87f38f8babcfe5f55ba889a85e1447f.jpg",
    "	https://i.pinimg.com/474x/4f/5b/e9/4f5be988c22f67182f9ee50395bbf0ae.jpg",
    "	https://i.pinimg.com/474x/4f/5b/e9/4f5be988c22f67182f9ee50395bbf0ae.jpg",
    "https://i.pinimg.com/474x/e4/aa/01/e4aa01e2f796ccd9d8702b31b93f3cd7.jpg",
    "https://i.pinimg.com/474x/11/86/0b/11860b98e1c2978bcd529d46748112f3.jpg",
  ];

  useEffect(() => {
    fetchPublishedNotes();
  }, []);

  const fetchPublishedNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      //   const token = localStorage.getItem("authToken");
      //   console.log("Token from localStorage:", token);

      //   if (!token) {
      //     setError("No authentication token found. Please log in.");
      //     setLoading(false);
      //     return;
      //   }

      const response = await axios.get(`${baseUri}/app/publishedNotes`);
      //   , {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      const notesWithCovers = response.data.findPublishedNotes.map((note) => {
        const randomCover =
          coverImages[Math.floor(Math.random() * coverImages.length)];
        return { ...note, cover: randomCover };
      });
      // console.log("API Response:", response.data);
      setNotes(notesWithCovers);
    } catch (error) {
      console.error("API Error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        // Clear invalid token
        localStorage.removeItem("authToken");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to fetch books. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userData) => {
    // Handle populated user object
    if (userData && typeof userData === "object") {
      return userData.username || userData.name || "Anonymous";
    }

    // Handle string (username or ID)
    if (userData && typeof userData === "string") {
      if (!userData.match(/^[0-9a-fA-F]{24}$/)) {
        return userData; // It's already a username
      }
    }

    return "Anonymous";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading notes...</p>
          <p className="text-gray-500 text-sm">
            Please note: The backend is hosted on a free-tier service, so
            initial responses may take a few seconds. We appreciate your
            patience.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-xl text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchPublishedNotes}
            className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-[4%]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-600 mb-8 text-center mt-3">
          Published Notes
        </h1>

        {notes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {notes.map((item) => (
              <div
                key={item._id}
                onClick={() => onReadBook(item._id)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg overflow-hidden aspect-[3/4] border-2 border-gray-300 relative">
                  {item.cover && (
                    <img
                      src={item.cover}
                      alt="Note Cover"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                    />
                  )}

                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-gray-400 to-gray-600 z-10"></div>

                  {/* Book content */}
                  <div className="p-4 h-full flex flex-col justify-between z-10 relative">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-3 leading-tight">
                        {item.title}
                      </h3>

                      <div className="space-y-1 mb-4">
                        <div className="h-px bg-gray-300 opacity-50"></div>
                        <div className="h-px bg-gray-300 opacity-30"></div>
                        <div className="h-px bg-gray-300 opacity-20"></div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-700 space-y-1">
                      <p className="font-medium">
                        Author: {getUserName(item.createdBy)}
                      </p>
                      <p className="text-gray-600">
                        {new Date(item.creation).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-700">No published books found.</p>
            <p className="text-gray-600 mt-2">
              Check back later for new publications!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNote;
