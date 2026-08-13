export interface BatteryTelemetry {
  supported: boolean;
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

export interface NetworkTelemetry {
  online: boolean;
  effectiveType: string;
  downlinkMbps: number | null;
  uplinkMbps: number | null;
  rttMs: number | null;
  saveData: boolean;
  type: string;
}

export interface MotionTelemetry {
  supported: boolean;
  permission: "granted" | "denied" | "prompt" | "unknown";
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    alpha: number;
    beta: number;
    gamma: number;
  };
}

export interface GpuTelemetry {
  available: boolean;
  vendor: string;
  renderer: string;
}

export interface DeviceTelemetry {
  timestamp: number;

  platform: string;
  userAgent: string;
  language: string;

  cpuCores: number | null;
  deviceMemoryGB: number | null;

  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;

  battery: BatteryTelemetry;
  network: NetworkTelemetry;
  motion: MotionTelemetry;
  gpu: GpuTelemetry;

  pageMemoryMB: number | null;
  estimatedWorkload: number;
  fps: number;
}

export type MachineStatus =
  | "HEALTHY"
  | "WARNING"
  | "CRITICAL";

export interface MachineTelemetry {
  timestamp: number;

  rpm: number;
  temperature: number;
  vibration: number;
  current: number;
  voltage: number;
  load: number;
  pressure: number;

  healthScore: number;
  risk: number;

  status: MachineStatus;

  degradation: number;
}

export interface MachinePoint {
  time: string;
  rpm: number;
  temperature: number;
  vibration: number;
  current: number;
  load: number;
}
