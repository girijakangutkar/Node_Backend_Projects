"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const ReadIt = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const getUserName = (userData) => {
    if (userData && typeof userData === "object") {
      return userData.username || userData.name || "Anonymous";
    }

    if (userData && typeof userData === "string") {
      return userData;
    }

    return "Anonymous";
  };

  useEffect(() => {
    if (book && book.content) {
      try {
        const parsedContent = JSON.parse(book.content);
        if (Array.isArray(parsedContent)) {
          const pageTexts = parsedContent
            .map((page) => page.content || page.text || page)
            .filter(Boolean);
          setPages(pageTexts.length > 0 ? pageTexts : ["No content available"]);
        } else if (parsedContent.content) {
          const wordsPerPage = 300;
          const words = parsedContent.content.split(" ");
          const pageArray = [];

          for (let i = 0; i < words.length; i += wordsPerPage) {
            pageArray.push(words.slice(i, i + wordsPerPage).join(" "));
          }

          setPages(pageArray.length > 0 ? pageArray : [parsedContent.content]);
        } else {
          setPages([JSON.stringify(parsedContent, null, 2)]);
        }
      } catch (error) {
        const wordsPerPage = 300;
        const words = book.content.split(" ");
        const pageArray = [];

        for (let i = 0; i < words.length; i += wordsPerPage) {
          pageArray.push(words.slice(i, i + wordsPerPage).join(" "));
        }

        setPages(pageArray.length > 0 ? pageArray : [book.content]);
      }
    }
  }, [book]);

  const nextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < pages.length) {
      nextPage();
    }
    if (isRightSwipe && currentPage > 1) {
      prevPage();
    }
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium hidden sm:inline">Back to Library</span>
        </button>

        <div className="text-center flex-1 mx-4">
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {book.title}
          </h1>
          <p className="text-sm text-gray-600">
            Author: {getUserName(book.createdBy)}
          </p>
        </div>

        <div className="text-sm text-gray-600 min-w-fit">
          Page {currentPage}/{pages.length}
        </div>
      </div>

      {/* Book Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div
          className="max-w-5xl w-full h-full bg-white shadow-2xl border-2 border-gray-200 relative overflow-hidden transform perspective-1000"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Book spine effect */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 shadow-inner"></div>

          {/* Book binding holes */}
          <div className="absolute left-2 top-8 bottom-8 w-0.5 bg-gray-600 opacity-30"></div>
          <div className="absolute left-2 top-12 w-1 h-1 bg-gray-600 opacity-40"></div>
          <div className="absolute left-2 bottom-12 w-1 h-1 bg-gray-600 opacity-40"></div>

          {/* Page content */}
          <div className="h-full ml-8 mr-4 py-12 px-8 overflow-y-auto text-justify">
            <div className="prose prose-gray max-w-none min-h-full">
              <div className="text-gray-900 leading-relaxed text-lg whitespace-pre-wrap font-serif">
                {pages[currentPage - 1] || "No content available"}
              </div>
            </div>
          </div>

          {/* Page number in corner */}
          <div className="absolute bottom-8 right-8 text-gray-400 opacity-60">
            <div className="text-sm font-serif italic">{currentPage}</div>
          </div>

          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50/20 to-gray-100/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-100 border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div
            className="flex items-center gap-2 text-justify font-merriweather
"
          >
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-3 h-3 transition-colors ${
                  currentPage === index + 1
                    ? "bg-gray-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadIt;
