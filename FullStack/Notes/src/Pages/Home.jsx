"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Plus, Trash, Upload, EyeOff } from "lucide-react";
import NoteForm from "./NoteForm";

const Home = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getNotes();
  }, []);

  const baseUri = import.meta.env.VITE_BASE_URI || "http://localhost:3000";

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const noteData = await axios.get(`${baseUri}/app/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(noteData.data.notes);
      setMsg(noteData.data.msg);
    } catch (error) {
      console.error(error.message);
      setErr(error.response?.data?.msg || error.message);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
    setIsOpen(false);
    setErr("");
    setMsg("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    const token = localStorage.getItem("authToken");
    try {
      const deletedNote = await axios.delete(`${baseUri}/app/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMsg(deletedNote.data.msg);
      getNotes();
    } catch (error) {
      console.error(error.message);
      setErr(error.response?.data?.msg || error.message);
    }
  };

  const publishThis = async (noteId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to publish this note? Once published, it will be visible to all users."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.patch(
        `${baseUri}/app/publishThis/${noteId}`,
        { publishStatus: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(response.data.msg);

      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, publishStatus: true } : note
        )
      );
      getNotes();
    } catch (error) {
      console.error("Error while publishing note:", error);
      setErr(error.response?.data?.msg || "Error publishing note");
    }
  };

  const unPublishThis = async (noteId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to publish this note? Once published, it will be visible to all users."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.patch(
        `${baseUri}/app/publishThis/${noteId}`,
        { publishStatus: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(response.data.msg);

      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, publishStatus: true } : note
        )
      );
      getNotes();
    } catch (error) {
      console.error("Error while publishing note:", error);
      setErr(error.response?.data?.msg || "Error publishing note");
    }
  };

  const timeAgo = (date) => {
    const timestamp =
      typeof date === "object" && date.$date ? date.$date : date;
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="flex flex-col p-4 md:p-10 min-h-screen mt-[3%]">
      {/* {err && <p className="text-red-500 text-center mb-4">{err}</p>}
      {msg && <p className="text-green-500 text-center mb-4">{msg}</p>} */}

      {isOpen && (
        <NoteForm
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
          editingId={editingId}
          msg={msg}
          setEditingId={setEditingId}
          setIsOpen={setIsOpen}
          setErr={setErr}
          setMsg={setMsg}
          getNotes={getNotes}
        />
      )}

      <div className="flex flex-col w-full">
        <h1 className="font-bold text-3xl text-gray-600 mb-8 text-center mt-5">
          Your collection:
        </h1>
        {notes.length == 0 ? (
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-lg">
            Note is empty
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pb-20">
            {notes.map((note) => (
              <div
                key={note._id}
                className="relative group bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 aspect-[3/4] flex flex-col overflow-hidden cursor-pointer"
                onClick={() => {
                  handleEdit(note);
                  setIsOpen(true);
                }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-sm md:text-base text-gray-800 line-clamp-3 leading-tight">
                      {note.title.toUpperCase()}
                    </h2>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="h-0.5 bg-gray-300 w-3/4"></div>
                    <div className="h-0.5 bg-gray-300 w-1/2"></div>
                    <div className="h-0.5 bg-gray-300 w-2/3"></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 border-t">
                  <p className="text-xs text-gray-500 text-left">
                    {note.creation &&
                      `Created: ${new Date(note.creation).toLocaleString()}`}
                  </p>
                  <p className="text-xs text-gray-500 text-left">
                    {`( ${timeAgo(note.creation)})`}
                  </p>
                  {note.publishStatus ? (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Published
                    </p>
                  ) : (
                    <div></div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note._id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md"
                >
                  <Trash size={12} />
                </button>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  {!note.publishStatus ? (
                    <button
                      onClick={(e) => publishThis(note._id, e)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-md"
                      title="Publish note"
                    >
                      <Upload size={13} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => unPublishThis(note._id, e)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md"
                      title="Suppress note"
                    >
                      <EyeOff size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="fixed bottom-10 right-10 bg-green-400 rounded-full w-10 h-10 flex justify-center items-center hover:bg-green-500 transition-colors">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setContent("");
              setEditingId(null);
              setErr("");
              setMsg("");
              setIsOpen(true);
            }}
            className="text-white font-bold"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
