import axios from "axios";
import React, { useState, useEffect } from "react";
import { Edit, Loader2Icon, Minimize2, Plus, Trash } from "lucide-react";

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

  const baseUri = import.meta.env.VITE_BASE_URI;

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
    }
  };

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
      console.log(error.message);
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

  const cancelEdit = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
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
      console.log(error.message);
      setErr(error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="flex flex-col p-10 m-10justify-center">
      {err && <p style={{ color: "red" }}>{err}</p>}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-[9999]">
          <form
            onSubmit={handleNote}
            className="relative flex flex-col border border-[#ccc] rounded-xl w-[30%] bg-white shadow-xl p-6"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              <Minimize2 />
            </button>

            <label htmlFor="title" className="mt-8 font-semibold text-lg">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="border border-[#ccc] p-2 mt-2 rounded-md"
            />

            <label htmlFor="content" className="mt-4 font-semibold text-lg">
              Content:
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content"
              className="border border-[#ccc] p-2 mt-2 rounded-md"
            />

            <button
              type="submit"
              className="mt-6 border border-blue-500 rounded-xl p-2 font-bold bg-green-600 text-white"
            >
              {editingId ? "Update Note" : "Add Note"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="mt-2 border border-blue-500 rounded-xl p-2 font-bold bg-red-500 text-white"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      <div className="flex flex-col justify-between rounded-lg w-full items-center text-left">
        <h3 className="font-bold mx-4 text-xl ">Notes:</h3>
        {notes.map((note) => (
          <div
            key={note._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
            className="flex flex-row justify-between rounded-lg w-3/5 items-center"
          >
            <div>
              <h2 className="font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-500">{note.content}</p>
            </div>
            <div className="flex flex-row justify-between">
              <button
                onClick={() => {
                  handleEdit(note);
                  setIsOpen(true);
                }}
                className="mx-4"
              >
                {editingId === note._id ? (
                  <Loader2Icon size={15} color="blue" />
                ) : (
                  <Edit size={15} color="blue" />
                )}
              </button>
              <button onClick={() => handleDelete(note._id)} className="mx-4">
                <Trash size={15} color="red" />
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center items-center content-center absolute bottom-10 right-15 bg-green-400 rounded-full w-10 h-10">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="font-bold text-5xl justify-center items-center leading-none"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
