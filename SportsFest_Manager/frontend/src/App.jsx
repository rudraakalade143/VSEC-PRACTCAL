
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Events from "./pages/Events.jsx";
import Results from "./pages/Results.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/results" element={<Results />} />
          </Routes>

          <footer>
            SportsFest Manager · College Sports Management
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}
