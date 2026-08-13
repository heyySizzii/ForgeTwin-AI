import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  description?: string;
  status?: "normal" | "warning" | "critical";
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  description,
  status = "normal"
}: MetricCardProps) {
  return (
    <motion.article
      className={`metric-card ${status}`}
      whileHover={{
        y: -3
      }}
    >
      <div className="metric-top">
        <div className="metric-symbol">
          <Icon size={17} />
        </div>

        <span>{label}</span>
      </div>

      <div className="metric-value">
        {value}

        {unit && (
          <small>{unit}</small>
        )}
      </div>

      {description && (
        <div className="metric-description">
          {description}
        </div>
      )}
    </motion.article>
  );
}
