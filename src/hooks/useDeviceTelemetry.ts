import { useEffect, useState } from "react";

type Telemetry = {
  battery: number | null;
  charging: boolean;
  online: boolean;
  downlink: number | null;
  memoryGB: number | null;
};

type ExtendedNavigator = Navigator & {
  getBattery?: () => Promise<{
    level: number;
    charging: boolean;
  }>;
  connection?: {
    downlink?: number;
  };
  deviceMemory?: number;
};

export function useDeviceTelemetry() {
  const [data, setData] = useState<Telemetry>({
    battery: null,
    charging: false,
    online: navigator.onLine,
    downlink: null,
    memoryGB: null,
  });

  useEffect(() => {
    const nav = navigator as ExtendedNavigator;

    setData((prev) => ({
      ...prev,
      online: navigator.onLine,
      downlink: nav.connection?.downlink ?? null,
      memoryGB: nav.deviceMemory ?? null,
    }));

    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        setData((prev) => ({
          ...prev,
          battery: Math.round(battery.level * 100),
          charging: battery.charging,
        }));
      });
    }

    const updateOnline = () => {
      setData((prev) => ({
        ...prev,
        online: navigator.onLine,
      }));
    };

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  return data;
}
