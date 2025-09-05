import axios from "axios";
import React, { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";
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

      // const sortedNotes = noteData.data.notes
      //   .filter((n) => n.creation.$date)
      //   .sort((a, b) => new Date(b.creation) - new Date(a.creation));

      // setNotes(sortedNotes);
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

  const truncateContent = (content) => {
    return content.slice(0, 100) + "...";
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
    <div className="flex flex-col p-10 m-10justify-center">
      {err && <p style={{ color: "red" }}>{err}</p>}
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

      <div className="flex flex-col justify-between rounded-lg w-full items-center text-left">
        <h1 className="font-bold mx-4 text-3xl text-gray-600">Notes:</h1>
        {notes.length == 0 ? (
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-lg">
            Note is empty
          </p>
        ) : (
          <>
            {" "}
            {notes.map((note) => (
              <div
                key={note._id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                }}
                className="flex flex-row justify-between rounded-lg w-4/4 sm:w-3/3 lg:w-3/4 md:w-3/4 xl:w-3/5 2xl:w-3/6 items-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(note);
                    setIsOpen(true);
                  }}
                >
                  <h2 className="font-semibold text-left text-lg font-semibold">
                    {note.title.toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-400 text-left">
                    {note.creation &&
                      `Created: ${new Date(
                        note.creation
                      ).toLocaleString()} (${timeAgo(note.creation)})`}
                  </p>

                  {/* <p className="text-sm text-gray-500 text-left">
                    {truncateContent(note.content)}
                  </p> */}
                </button>
                <div className="flex flex-row justify-between">
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="mx-4"
                  >
                    <Trash size={15} color="red" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="flex justify-center items-center content-center fixed bottom-10 right-15 bg-green-400 rounded-full w-10 h-10">
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
