import {
  Activity,
  Bot,
  Boxes,
  Cpu,
  Gauge,
  LayoutDashboard,
  Settings,
  Wrench
} from "lucide-react";

const items = [
  {
    label: "Overview",
    icon: LayoutDashboard
  },
  {
    label: "Device",
    icon: Cpu
  },
  {
    label: "Machines",
    icon: Boxes
  },
  {
    label: "Telemetry",
    icon: Activity
  },
  {
    label: "Maintenance",
    icon: Wrench
  },
  {
    label: "Simulation",
    icon: Gauge
  },
  {
    label: "AI Assistant",
    icon: Bot
  }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Cpu size={20} />
        </div>

        <div>
          <strong>
            ForgeTwin
          </strong>

          <span>
            AI
          </span>
        </div>
      </div>

      <nav>
        {items.map(
          (item, index) => {
            const Icon =
              item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  index === 0
                    ? "active"
                    : ""
                }`}
              >
                <Icon size={18} />

                <span>
                  {item.label}
                </span>
              </button>
            );
          }
        )}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings size={18} />
          <span>
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
}
