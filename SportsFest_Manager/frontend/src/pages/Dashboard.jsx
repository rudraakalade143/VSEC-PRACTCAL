import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const [dashboardResponse, eventsResponse] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/events")
      ]);

      if (!dashboardResponse.ok || !eventsResponse.ok) {
        throw new Error("Could not load dashboard data.");
      }

      setData(await dashboardResponse.json());
      setEvents(await eventsResponse.json());
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="muted">Welcome to SportsFest Manager.</p>
        </div>
        <span className="date-badge">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </span>
      </div>

      {error && <p className="error">{error}</p>}

      {!data ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard title="Total Events" value={data.eventsCount} icon="⚽" />
            <StatCard title="Participating Teams" value={data.teamsCount} icon="👥" />
            <StatCard title="Results Recorded" value={data.resultsCount} icon="🏆" />
            <StatCard title="Upcoming Events" value={data.upcomingEvents} icon="📅" />
          </div>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Upcoming Events</h2>
                <p className="muted">Your scheduled sports activities</p>
              </div>
              <span className="pill">{events.length} total</span>
            </div>

            {events.length === 0 ? (
              <div className="empty-state">
                <span>⚽</span>
                <h3>No events added yet</h3>
                <p>Go to Manage Events to add your first sports event.</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {events.slice(0, 8).map(event => (
                      <tr key={event._id}>
                        <td>{event.eventName}</td>
                        <td>{event.sport}</td>
                        <td>{event.teamName}</td>
                        <td>{event.department}</td>
                        <td>{event.eventDate}</td>
                        <td>{event.venue}</td>
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
                <h2>Department Leaderboard</h2>
                <p className="muted">Top departments by points</p>
              </div>
            </div>

            {data.leaderboard.length === 0 ? (
              <p className="muted">No results recorded yet.</p>
            ) : (
              data.leaderboard.map((item, index) => (
                <div className="leader-row" key={item.department}>
                  <span className="rank">{index + 1}</span>
                  <strong>{item.department}</strong>
                  <span className="muted">{item.wins} result(s)</span>
                  <strong className="points">{item.points} pts</strong>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <h2>{value}</h2>
    </div>
  );
}