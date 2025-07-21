import React, { useState, useEffect } from "react";
import { Minimize2 } from "lucide-react";
import axios from "axios";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

const NoteForm = ({
  title,
  content,
  setTitle,
  setContent,
  editingId,
  msg,
  setEditingId,
  setErr,
  setIsOpen,
  setMsg,
  getNotes,
}) => {
  const baseUri = import.meta.env.VITE_BASE_URI;

  const [loading, setLoading] = useState(false);

  const handleNote = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    // Add validation
    if (!title.trim() || !content.trim()) {
      setErr("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (editingId) {
        const updateNote = await axios.put(
          `${baseUri}/app/notes/${editingId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMsg(updateNote.data.msg);
        setEditingId(null);
      } else {
        const noteData = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/app/notes`,
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMsg(noteData.data.msg);
      }

      setTitle("");
      setContent("");
      setIsOpen(false);
      getNotes();
    } catch (error) {
      console.log(error.message);
      setErr(error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = async () => {
    await autoSaveDraft();
    setTitle("");
    setContent("");
    setEditingId(null);
    setIsOpen(false);
    setErr("");
    setMsg("");
  };

  const autoSaveDraft = async () => {
    if (!title.trim() && !content.trim()) return;

    const token = localStorage.getItem("authToken");
    try {
      if (editingId) {
        await axios.put(
          `${baseUri}/app/notes/${editingId}`,
          { title, content },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${baseUri}/app/notes`,
          { title, content },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      getNotes();
    } catch (error) {
      console.log("Auto-save error:", error.message);
    }
  };

  if (loading) {
    return (
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-lg">
        Loading...
      </p>
    );
  }

  return (
    // transparent background bg-black/30
    <>
      <div className="fixed transparent background bg-black/30 inset-0 z-[9999] flex justify-center items-center overflow-auto">
        <form
          className="flex flex-col relative w-[90%] max-w-2xl bg-white p-6 shadow-lg border-[#ccc] rounded-lg"
          onSubmit={handleNote}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            <Minimize2 size={20} color="red" />
          </button>

          <label htmlFor="title" className="mt-8 font-semibold text-2xl">
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            className="border border-[#ccc] p-5 mt-2 rounded-md"
          />

          <label htmlFor="content" className="mt-4 font-semibold text-2xl">
            Content:
          </label>
          {/* <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Enter note content"
            className="border border-[#ccc] p-5 mt-2 rounded-md"
          /> */}
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note content"
            className="border border-[#ccc] p-5 mt-2 rounded-md"
          />

          <div className="flex flex-row gap-2 mt-10 justify-center items-center">
            <button
              type="submit"
              className="mt-2 border border-blue-500 rounded-xl p-4 text-lg font-bold bg-green-600 text-white w-1/2"
            >
              {editingId ? "Update Note" : "Add Note"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="mt-2 border border-blue-500 rounded-xl  p-4 text-lg font-bold bg-red-500 text-white w-1/2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default NoteForm;
