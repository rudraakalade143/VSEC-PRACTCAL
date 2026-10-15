import { useEffect, useState } from "react";

export default function Results() {
  const [events, setEvents] = useState([]);
  const [results, setResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [form, setForm] = useState({
    event: "",
    winnerDepartment: "",
    points: "10"
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const responses = await Promise.all([
        fetch("/api/events"),
        fetch("/api/results"),
        fetch("/api/leaderboard")
      ]);

      if (responses.some(response => !response.ok)) {
        throw new Error("Could not load results data.");
      }

      const [eventData, resultData, leaderboardData] = await Promise.all(
        responses.map(response => response.json())
      );

      setEvents(eventData);
      setResults(resultData);
      setLeaderboard(leaderboardData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: form.event,
          winnerDepartment: form.winnerDepartment,
          points: Number(form.points)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save result.");
      }

      setForm({ event: "", winnerDepartment: "", points: "10" });
      setMessage("Result recorded successfully.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteResult(id) {
    if (!window.confirm("Delete this result?")) return;

    try {
      const response = await fetch(`/api/results/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete result.");
      }

      setMessage("Result deleted successfully.");
      setError("");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">COMPETITION TRACKING</p>
          <h1>Results & Leaderboard</h1>
          <p className="muted">Record results and track department points.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Record a Result</h2>
            <p className="muted">Select an event and enter its winning department.</p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <h3>No events available</h3>
            <p>Add an event in Manage Events before recording a result.</p>
          </div>
        ) : (
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label>Event</label>
              <select name="event" value={form.event} onChange={handleChange} required>
                <option value="">Select event</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.eventName} — {event.sport}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Winning Department</label>
              <select name="winnerDepartment" value={form.winnerDepartment} onChange={handleChange} required>
                <option value="">Select department</option>
                {["Information Technology", "Computer Engineering", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Electronics Engineering", "Other"].map(department => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Points (0–100)</label>
              <input
                type="number"
                name="points"
                min="0"
                max="100"
                value={form.points}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary">＋ Record Result</button>
            </div>
          </form>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Department Leaderboard</h2>
            <p className="muted">Ranked by total points, then number of recorded results.</p>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <p className="muted">No results recorded yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Department</th>
                  <th>Results</th>
                  <th>Total Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item.department}>
                    <td><span className="rank">{index + 1}</span></td>
                    <td><strong>{item.department}</strong></td>
                    <td>{item.wins}</td>
                    <td><strong className="points">{item.points}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Recorded Results</h2>
            <p className="muted">Results saved in your database</p>
          </div>
          <span className="pill">{results.length} results</span>
        </div>

        {results.length === 0 ? (
          <p className="muted">No results to display.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Sport</th>
                  <th>Winner</th>
                  <th>Points</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result._id}>
                    <td>{result.event?.eventName || "Event deleted"}</td>
                    <td>{result.event?.sport || "—"}</td>
                    <td>{result.winnerDepartment}</td>
                    <td>{result.points}</td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteResult(result._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}