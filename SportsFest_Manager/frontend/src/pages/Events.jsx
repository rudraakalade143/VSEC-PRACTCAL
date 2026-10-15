import { useEffect, useState } from "react";

const emptyForm = {
  eventName: "",
  sport: "",
  teamName: "",
  department: "",
  eventDate: "",
  venue: ""
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadEvents() {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Could not load events.");
      setEvents(await response.json());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not add event.");
      }

      setForm(emptyForm);
      setMessage("Event added successfully.");
      await loadEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete event.");
      }

      setMessage("Event deleted successfully.");
      setError("");
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">EVENT MANAGEMENT</p>
          <h1>Manage Events</h1>
          <p className="muted">Add and manage your sports events.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Add New Event</h2>
            <p className="muted">Enter the sports event details below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label>Event Name</label>
            <input name="eventName" value={form.eventName} onChange={handleChange} placeholder="e.g. Interdepartment Football" required />
          </div>

          <div className="field">
            <label>Sport</label>
            <select name="sport" value={form.sport} onChange={handleChange} required>
              <option value="">Select sport</option>
              {["Cricket", "Football", "Volleyball", "Basketball", "Badminton", "Chess", "Kabaddi", "Athletics", "Other"].map(sport => (
                <option key={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Team Name</label>
            <input name="teamName" value={form.teamName} onChange={handleChange} placeholder="e.g. IT Warriors" required />
          </div>

          <div className="field">
            <label>Department</label>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select department</option>
              {["Information Technology", "Computer Engineering", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Electronics Engineering", "Other"].map(department => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Event Date</label>
            <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
          </div>

          <div className="field">
            <label>Venue</label>
            <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. College Ground" required />
          </div>

          <div className="form-actions">
            <button className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "＋ Add Event"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>All Events</h2>
            <p className="muted">Events saved in your database</p>
          </div>
          <span className="pill">{events.length} events</span>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <span>📅</span>
            <h3>No events yet</h3>
            <p>Use the form above to create your first event.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Sport</th>
                  <th>Team</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id}>
                    <td>{event.eventName}</td>
                    <td>{event.sport}</td>
                    <td>{event.teamName}</td>
                    <td>{event.department}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.venue}</td>
                    <td>
                      <button className="btn-delete" onClick={() => deleteEvent(event._id)}>Delete</button>
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