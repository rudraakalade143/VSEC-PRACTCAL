
import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  function login(e) {
    e.preventDefault();
    setPage(2);
  }

  function addNote(e) {
    e.preventDefault();

    const note = { title, content };

    if (editIndex === -1) {
      setNotes([...notes, note]);
    } else {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = note;
      setNotes(updatedNotes);
      setEditIndex(-1);
    }

    setTitle("");
    setContent("");
    setPage(3);
  }

  function editNote(index) {
    setTitle(notes[index].title);
    setContent(notes[index].content);
    setEditIndex(index);
    setPage(2);
  }

  function deleteNote(index) {
    setNotes(notes.filter((note, i) => i !== index));
  }

  // PAGE 1: LOGIN
  if (page === 1) {
    return (
      <div className="container">
        <h1>DailyNotes</h1>
        <h2>Login Page</h2>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // PAGE 2: ADD NOTES
  if (page === 2) {
    return (
      <div className="container">
        <h1>DailyNotes</h1>
        <h2>Add Notes</h2>

        <p>Welcome, {email}!</p>

        <form onSubmit={addNote}>
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
            {editIndex === -1 ? "Add Note" : "Update Note"}
          </button>
        </form>

        <button onClick={() => setPage(3)}>
          View Saved Notes
        </button>

        <button onClick={() => setPage(1)}>Logout</button>
      </div>
    );
  }

  // PAGE 3: DISPLAY NOTES
  return (
    <div className="container">
      <h1>Display Page</h1>

      <button onClick={() => setPage(2)}>Add Another Note</button>
      <button onClick={() => setPage(1)}>Logout</button>

      <h2>Saved Notes</h2>

      {notes.length === 0 && <p>No notes available.</p>}

      {notes.map((note, index) => (
        <div className="note" key={index}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <button onClick={() => editNote(index)}>Edit</button>
          <button onClick={() => deleteNote(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
