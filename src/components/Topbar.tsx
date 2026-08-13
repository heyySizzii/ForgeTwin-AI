import {
  Bell,
  Search
} from "lucide-react";

export function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={16} />

        <input
          placeholder="Search machines, telemetry, alerts..."
        />

        <kbd>
          Ctrl K
        </kbd>
      </div>

      <div className="top-actions">
        <div className="simulation-indicator">
          <span />
          DEVICE + SIMULATION
        </div>

        <button
          className="icon-button"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="avatar">
          SK
        </div>
      </div>
    </header>
  );
}
