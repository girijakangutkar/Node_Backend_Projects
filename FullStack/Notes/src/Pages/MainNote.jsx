"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const MainNote = ({ onReadBook }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUri = import.meta.env.VITE_BASE_URI || "http://localhost:3000";

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

      // console.log("API Response:", response.data);
      setNotes(response.data.findPublishedNotes);
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
          <p className="text-gray-700">Loading books...</p>
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
        <h1 className="text-3xl font-bold text-gray-600 mb-8 text-center">
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
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-gray-400 to-gray-600"></div>

                  {/* Book content */}
                  <div className="p-4 h-full flex flex-col justify-between">
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
                  <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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
