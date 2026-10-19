import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [page, setPage] = useState(1);
  const [authMode, setAuthMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // Register or Login
  async function handleAuth(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/${authMode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Request failed.");
        return;
      }

      setUser(data);
      setPassword("");
      setMessage("");
      setPage(2);
    } catch (error) {
      setMessage("Cannot connect to backend. Check server.");
    }
  }

  // Load notes from MongoDB
  useEffect(() => {
    if (page !== 3 || !user) return;

    async function loadNotes() {
      try {
        const response = await fetch(
          `${API}/notes/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Could not load notes.");
          return;
        }

        setNotes(data);
        setMessage("");
      } catch (error) {
        setMessage("Could not connect to backend.");
      }
    }

    loadNotes();
  }, [page, user]);

  // Add or Update note
  async function saveNote(e) {
    e.preventDefault();
    setMessage("");

    const isEditing = Boolean(editId);
    const url = isEditing
      ? `${API}/notes/${editId}`
      : `${API}/notes`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          title,
          content
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not save note.");
        return;
      }

      setTitle("");
      setContent("");
      setEditId(null);
      setMessage("Note saved successfully.");
      setPage(3);
    } catch (error) {
      setMessage("Could not connect to backend.");
    }
  }

  // Edit note
  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
    setMessage("");
    setPage(2);
  }

  // Delete note
  async function deleteNote(id) {
    const confirmDelete = window.confirm(
      "Do you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not delete note.");
        return;
      }

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note._id !== id)
      );

      setMessage("Note deleted successfully.");
    } catch (error) {
      setMessage("Could not connect to backend.");
    }
  }

  // Clear form and add another note
  function openAddPage() {
    setTitle("");
    setContent("");
    setEditId(null);
    setMessage("");
    setPage(2);
  }

  // Logout
  function logout() {
    setUser(null);
    setNotes([]);
    setEmail("");
    setPassword("");
    setTitle("");
    setContent("");
    setEditId(null);
    setMessage("");
    setPage(1);
  }

  // PAGE 1: REGISTER / LOGIN
  if (page === 1) {
    return (
      <div className="container">
        <h1>DailyNotes</h1>

        <h2>
          {authMode === "login" ? "Login Page" : "Register Page"}
        </h2>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password (min 4 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={4}
            required
          />

          <button type="submit">
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p>
          {authMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>

        <button
          onClick={() => {
            setAuthMode(
              authMode === "login" ? "register" : "login"
            );
            setMessage("");
          }}
        >
          {authMode === "login" ? "Create Account" : "Go to Login"}
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  // PAGE 2: ADD / EDIT NOTE
  if (page === 2) {
    return (
      <div className="container">
        <h1>DailyNotes</h1>
        <h2>{editId ? "Edit Note" : "Add Notes"}</h2>

        <p>Welcome, {user.email}!</p>

        <form onSubmit={saveNote}>
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Enter note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button type="submit">
            {editId ? "Update Note" : "Add Note"}
          </button>
        </form>

        <button onClick={() => setPage(3)}>
          View Saved Notes
        </button>

        <button onClick={logout}>Logout</button>

        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  // PAGE 3: DISPLAY NOTES
  return (
    <div className="container">
      <h1>DailyNotes</h1>
      <h2>Saved Notes</h2>

      <p>Welcome, {user.email}!</p>

      <button onClick={openAddPage}>Add Another Note</button>
      <button onClick={logout}>Logout</button>

      {message && <p className="message">{message}</p>}

      {notes.length === 0 && (
        <p>No notes available. Add your first note!</p>
      )}

      {notes.map((note) => (
        <div className="note" key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <button onClick={() => editNote(note)}>
            Edit
          </button>

          <button onClick={() => deleteNote(note._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;