import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Save,
  X,
} from "lucide-react";

const BookNoteApp = ({
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

  // Initialize pages from content if editing
  useEffect(() => {
    console.log("Initializing with:", { title, content, editingId });

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
        console.log("Content is not JSON, treating as single page");
        setPages([{ id: 1, content: content || "" }]);
      }
    } else {
      // New note
      setPages([{ id: 1, content: "" }]);
    }

    isInitializing.current = false;
  }, [title, content, editingId]);

  // Focus on the current page's textarea when it changes
  useEffect(() => {
    if (textareaRefs.current[currentPage]) {
      textareaRefs.current[currentPage].focus();

      // Move cursor to end of text
      const textarea = textareaRefs.current[currentPage];
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    }
  }, [currentPage]);

  // Auto-save functionality
  const autoSave = async () => {
    // Don't save during initialization or if already saving
    if (isInitializing.current || isSavingRef.current) return;

    isSavingRef.current = true;

    // Filter out empty pages (except the first one)
    const nonEmptyPages = pages.filter(
      (page, index) => index === 0 || page.content.trim() !== ""
    );

    // Update pages if we removed any empty ones
    if (nonEmptyPages.length !== pages.length) {
      setPages(nonEmptyPages);
      if (currentPage >= nonEmptyPages.length) {
        setCurrentPage(nonEmptyPages.length - 1);
      }
    }

    // If all pages are empty and no title, don't save
    if (
      !bookTitle.trim() &&
      nonEmptyPages.every((page) => !page.content.trim())
    ) {
      console.log("Nothing to save");
      isSavingRef.current = false;
      return;
    }

    setIsAutoSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      const baseUri = import.meta.env.VITE_BASE_URI || "http://localhost:5000";
      const contentData = JSON.stringify(nonEmptyPages);

      console.log("Auto-saving:", { title: bookTitle, content: contentData });

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
          if (data.id || data._id) {
            setEditingId(data.id || data._id);
          }
        }
      }

      if (response.ok) {
        setLastSaved(new Date());
        // Update parent component state
        setTitle(bookTitle);
        setContent(contentData);
        if (getNotes) getNotes();
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

  // Debounced auto-save
  const debouncedAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000); // Save after 2 seconds of inactivity
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

  // Check if page is empty and should be removed
  const checkAndRemoveEmptyPage = (pageIndex, newContent) => {
    // Don't remove the first page even if it's empty
    if (pageIndex === 0) return false;

    // If content is empty, remove the page
    if (!newContent.trim()) {
      const updatedPages = [...pages];
      updatedPages.splice(pageIndex, 1);
      setPages(updatedPages);

      // Move to previous page if we removed the current page
      if (pageIndex === currentPage) {
        setCurrentPage(Math.max(0, pageIndex - 1));
      }

      // Trigger save after removing page
      debouncedAutoSave();
      return true;
    }

    return false;
  };

  // Handle page content change
  const handlePageContentChange = (pageIndex, newContent) => {
    console.log("Page content changed:", pageIndex, newContent);

    // Store the current content before updating
    previousContentRef.current = pages[pageIndex]?.content || "";

    // First check if we should remove this page (if it's empty and not the first page)
    // Only remove if the content is completely empty, not just whitespace
    if (
      pageIndex > 0 &&
      newContent === "" &&
      previousContentRef.current === ""
    ) {
      if (checkAndRemoveEmptyPage(pageIndex, newContent)) {
        return;
      }
    }

    const updatedPages = [...pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      content: newContent,
    };
    setPages(updatedPages);

    // Check if we need to create a new page due to overflow
    setTimeout(() => {
      checkAndCreateNewPage(newContent, pageIndex);
    }, 100);

    debouncedAutoSave();
  };

  // Handle title change
  const handleTitleChange = (newTitle) => {
    console.log("Title changed:", newTitle);
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
    autoSave(); // Final save before closing
    setIsOpen(false);
  };

  console.log("Current state:", { pages, currentPage, bookTitle });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-2xl overflow-hidden">
        {/* Book Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-4 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mr-12">
            <BookOpen size={24} />
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter book title..."
              className="bg-transparent border-b-2 border-white border-opacity-50 text-xl font-semibold text-white placeholder-amber-200 focus:outline-none focus:border-opacity-100 flex-1"
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-sm opacity-80">
            <span>
              Page {currentPage + 1} of {pages.length}
            </span>
            <div className="flex items-center gap-2">
              {isAutoSaving ? (
                <span className="flex items-center gap-1">
                  <Save size={14} className="animate-pulse" />
                  Saving...
                </span>
              ) : lastSaved ? (
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Book Content */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ height: "calc(100% - 140px)" }}
        >
          {/* Page Navigation */}
          <div className="absolute inset-0 flex">
            {/* Previous Page Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
                currentPage === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-amber-700 text-white hover:bg-amber-800 shadow-lg"
              }`}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Page Content Area */}
            <div
              className="flex-1 mx-16 relative overflow-hidden"
              onTouchStart={(e) =>
                (handleTouchStart.current = e.touches[0].clientX)
              }
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full h-full relative">
                {/* Current Page */}
                <div
                  className="w-full h-full p-8 relative"
                  style={{
                    background: `
                      linear-gradient(to right, transparent 36px, #dc2626 37px, #dc2626 38px, transparent 39px),
                      repeating-linear-gradient(
                        transparent,
                        transparent 24px,
                        #cbd5e1 24px,
                        #cbd5e1 25px
                      ),
                      #fffef7
                    `,
                    backgroundSize: "100% 100%, 100% 25px, 100% 100%",
                    backgroundPosition: "0 0, 0 0, 0 0",
                  }}
                >
                  {/* Page textarea */}
                  <textarea
                    key={`page-${pages[currentPage]?.id}-${currentPage}`}
                    ref={(el) => (textareaRefs.current[currentPage] = el)}
                    value={pages[currentPage]?.content || ""}
                    onChange={(e) =>
                      handlePageContentChange(currentPage, e.target.value)
                    }
                    placeholder="Start writing your story..."
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 overflow-hidden"
                    style={{
                      lineHeight: "28px",
                      fontSize: "16px",
                      fontFamily: "Georgia, Times, serif",
                      paddingLeft: "48px",
                      paddingTop: "8px",
                      paddingRight: "16px",
                      color: "#1f2937",
                      paddingBottom: "8px",
                      height: "500px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pages.length - 1}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
                currentPage === pages.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-amber-700 text-white hover:bg-amber-800 shadow-lg"
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Book Footer */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-4 flex justify-between items-center text-white">
          <div className="flex gap-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentPage ? "bg-white" : "bg-white bg-opacity-40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={addNewPage}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookNoteApp;
