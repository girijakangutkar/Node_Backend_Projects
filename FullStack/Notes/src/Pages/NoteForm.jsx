"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Save,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

const NoteForm = ({
  title,
  content,
  setTitle,
  setContent,
  editingId,
  setEditingId,
  setErr,
  setIsOpen,
  setMsg,
  getNotes,
}) => {
  const [pages, setPages] = useState([{ id: 1, content: "" }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const isInitializing = useRef(true);
  const textareaRefs = useRef([]);
  const isSavingRef = useRef(false);
  const previousContentRef = useRef("");
  const latestContentRef = useRef(pages);

  // Initialize pages from content if editing
  useEffect(() => {
    // console.log("Initializing with:", { title, content, editingId });

    if (title) {
      setBookTitle(title);
    }

    if (content) {
      try {
        // Try to parse as JSON first (for multi-page notes)
        const parsedPages = JSON.parse(content);
        if (Array.isArray(parsedPages) && parsedPages.length > 0) {
          setPages(parsedPages);
        } else {
          // If it's a single page content
          setPages([{ id: 1, content: content }]);
        }
      } catch (error) {
        // If JSON parsing fails, treat as single page content
        console.error("Content is not JSON, treating as single page");
        setPages([{ id: 1, content: content || "" }]);
      }
    } else {
      // New note
      setPages([{ id: 1, content: "" }]);
    }

    isInitializing.current = false;
  }, [title, content, editingId]);

  useEffect(() => {
    latestContentRef.current = pages;
  }, [pages]);

  // Focus on the current page's textarea when it changes
  useEffect(() => {
    if (textareaRefs.current[currentPage]) {
      textareaRefs.current[currentPage].focus();

      // Move cursor to end of text
      const textarea = textareaRefs.current[currentPage];
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }
  }, [currentPage]);

  // Clean up empty pages
  const cleanupEmptyPages = (pagesToClean) => {
    // Filter out empty pages (except the first one)
    const nonEmptyPages = pagesToClean.filter(
      (page, index) => index === 0 || page.content.trim() !== ""
    );

    // Ensure we always have at least one page
    if (nonEmptyPages.length === 0) {
      return [{ id: 1, content: "" }];
    }

    return nonEmptyPages;
  };

  // Auto-save functionality
  const autoSave = async (isClosing = false) => {
    // Don't save during initialization or if already saving
    if (isInitializing.current || isSavingRef.current) return;

    isSavingRef.current = true;

    // Use the latest content from the ref instead of state
    const currentPages = latestContentRef.current;

    // Clean up empty pages (only when closing)
    const pagesToSave = isClosing
      ? cleanupEmptyPages(currentPages)
      : currentPages;

    // If all pages are empty and no title, don't save
    if (
      !bookTitle.trim() &&
      pagesToSave.every((page) => !page.content.trim())
    ) {
      // console.log("Nothing to save");
      isSavingRef.current = false;
      return;
    }

    setIsAutoSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      const baseUri = import.meta.env.VITE_BASE_URI || "http://localhost:3000";
      const contentData = JSON.stringify(pagesToSave);

      // console.log("Auto-saving:", {
      //   title: bookTitle,
      //   content: contentData,
      //   editingId,
      // });

      let response;
      if (editingId) {
        // UPDATE existing note
        response = await fetch(`${baseUri}/app/notes/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: bookTitle, content: contentData }),
        });
      } else {
        // CREATE new note only if we don't have an editingId
        response = await fetch(`${baseUri}/app/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: bookTitle, content: contentData }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.addData && (data.addData.id || data.addData._id)) {
            setEditingId(data.addData.id || data.addData._id);
          }
        }
      }

      if (response.ok) {
        setLastSaved(new Date());
        // Update parent component state
        setTitle(bookTitle);
        setContent(contentData);
        if (getNotes) getNotes();

        // Update local pages if we cleaned them up
        if (isClosing && pagesToSave.length !== currentPages.length) {
          setPages(pagesToSave);
        }
      } else {
        console.error("Auto-save failed:", response.statusText);
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsAutoSaving(false);
      isSavingRef.current = false;
    }
  };

  // Debounced auto-save with longer delay to prevent interrupting typing
  const debouncedAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000); // Increased to 2 seconds to prevent interrupting typing
  };

  // Check if content overflows and create new page if needed
  const checkAndCreateNewPage = (content, pageIndex) => {
    const textarea = textareaRefs.current[pageIndex];
    if (!textarea) return;

    // Check if content overflows the textarea
    if (textarea.scrollHeight > textarea.clientHeight) {
      const lines = content.split("\n");
      const lineHeight = 28; // Based on your line-height style
      const maxLines = Math.floor(textarea.clientHeight / lineHeight);

      if (lines.length > maxLines) {
        // Split content between current page and new page
        const currentContent = lines.slice(0, maxLines).join("\n");
        const newContent = lines.slice(maxLines).join("\n");

        // Update current page
        const updatedPages = [...pages];
        updatedPages[pageIndex] = {
          ...updatedPages[pageIndex],
          content: currentContent,
        };

        // Add new page with remaining content
        const newPage = {
          id:
            pages.length > 0 ? Math.max(...pages.map((p) => p.id || 0)) + 1 : 1,
          content: newContent,
        };

        updatedPages.splice(pageIndex + 1, 0, newPage);
        setPages(updatedPages);

        // Automatically move to the new page
        setTimeout(() => {
          setCurrentPage(pageIndex + 1);
        }, 50);

        // Trigger save after creating new page
        debouncedAutoSave();
      }
    }
  };

  // Handle page content change
  const handlePageContentChange = (pageIndex, newContent) => {
    // console.log("Page content changed:", pageIndex, newContent);

    const updatedPages = [...pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      content: newContent,
    };
    setPages(updatedPages);

    // Update the ref immediately
    latestContentRef.current = updatedPages;

    // Check if we need to create a new page due to overflow
    setTimeout(() => {
      checkAndCreateNewPage(newContent, pageIndex);
    }, 100);

    debouncedAutoSave();
  };
  // Handle title change
  const handleTitleChange = (newTitle) => {
    // console.log("Title changed:", newTitle);
    setBookTitle(newTitle);
    debouncedAutoSave();
  };

  // Add new page
  const addNewPage = () => {
    const newPage = {
      id: pages.length > 0 ? Math.max(...pages.map((p) => p.id || 0)) + 1 : 1,
      content: "",
    };
    const newPages = [...pages, newPage];
    setPages(newPages);
    setCurrentPage(newPages.length - 1);
  };

  // Navigate pages
  const goToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  // Handle swipe/slide gestures
  const handleTouchStart = useRef(null);
  const handleTouchEnd = (e) => {
    if (!handleTouchStart.current) return;

    const touchEnd = e.changedTouches[0].clientX;
    const touchStart = handleTouchStart.current;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0 && currentPage < pages.length - 1) {
        // Swipe left - next page
        setCurrentPage(currentPage + 1);
      } else if (diff < 0 && currentPage > 0) {
        // Swipe right - previous page
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleClose = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSave(true); // Final save before closing with cleanup
    setIsOpen(false);
  };

  // console.log("Current state:", { pages, currentPage, bookTitle, editingId });

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex flex-col">
      <div className="relative w-full h-full bg-gradient-to-b from-amber-50 to-amber-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Book Header */}
        <div className="bg-gray-800 p-3 md:p-4 text-white relative flex-shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-3 md:top-4 left-3 md:left-4 hover:bg-gray-700 hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3 ml-12 mr-4">
            <BookOpen size={20} className="md:w-6 md:h-6" />
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter book title..."
              className="bg-transparent border-b-2 border-white border-opacity-50 text-lg md:text-xl font-semibold text-white placeholder-amber-200 focus:outline-none focus:border-opacity-100 flex-1"
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-xs md:text-sm opacity-80">
            <span>
              Page {currentPage + 1} of {pages.length}
            </span>
            <div className="flex items-center gap-2">
              {isAutoSaving ? (
                <span className="flex items-center gap-1">
                  <Save size={12} className="md:w-3.5 md:h-3.5 animate-pulse" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              ) : lastSaved ? (
                <span className="hidden sm:inline">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Book Content */}
        <div
          className="flex-1 relative overflow-hidden min-h-0"
          style={{ height: "calc(100% - 140px)" }}
        >
          {/* Page Content Area - Full Width */}
          <div
            className="w-full h-full relative"
            onTouchStart={(e) =>
              (handleTouchStart.current = e.touches[0].clientX)
            }
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full h-full relative">
              <div className="w-full h-full p-4 md:p-6 lg:p-8 relative bg-white">
                {/* Page textarea - Full width and responsive */}
                <textarea
                  key={`page-${pages[currentPage]?.id}-${currentPage}`}
                  ref={(el) => (textareaRefs.current[currentPage] = el)}
                  value={pages[currentPage]?.content || ""}
                  onChange={(e) =>
                    handlePageContentChange(currentPage, e.target.value)
                  }
                  placeholder="Start writing your story..."
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 overflow-auto"
                  style={{
                    lineHeight: "1.6",
                    fontSize: "16px",
                    fontFamily: "Georgia, Times, serif",
                    color: "#1f2937",
                    padding: "0",
                    minHeight: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-3 md:p-4 flex justify-between items-center text-white flex-shrink-0">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Page Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={`p-2 md:p-3 rounded-full transition-all ${
                currentPage === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-600 shadow-lg"
              }`}
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </button>

            {/* Page Indicators */}
            <div className="flex gap-1 mx-2">
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === currentPage
                      ? "bg-white"
                      : "bg-white bg-opacity-40"
                  }`}
                />
              ))}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pages.length - 1}
              className={`p-2 md:p-3 rounded-full transition-all ${
                currentPage === pages.length - 1
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-600 shadow-lg"
              }`}
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </button>
          </div>

          {/* Add Page Button */}
          <button
            onClick={addNewPage}
            className="flex items-center gap-2 bg-green-700 bg-opacity-20 hover:bg-opacity-30 px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
          >
            <Plus size={16} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
