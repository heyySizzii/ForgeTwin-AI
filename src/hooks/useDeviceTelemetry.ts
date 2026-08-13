import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { getGpuTelemetry } from "../lib/gpu";
import { round } from "../lib/format";

import type {
  BatteryTelemetry,
  DeviceTelemetry,
  MotionTelemetry,
  NetworkTelemetry
} from "../types/telemetry";

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;

  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
    onchange?: () => void;
  };

  mozConnection?: ExtendedNavigator["connection"];
  webkitConnection?: ExtendedNavigator["connection"];

  getBattery?: () => Promise<any>;
}

function getConnection() {
  const navigatorWithConnection =
    navigator as ExtendedNavigator;

  return (
    navigatorWithConnection.connection ??
    navigatorWithConnection.mozConnection ??
    navigatorWithConnection.webkitConnection ??
    null
  );
}

function getNetworkTelemetry(): NetworkTelemetry {
  const connection = getConnection();

  return {
    online: navigator.onLine,

    effectiveType:
      connection?.effectiveType ??
      "unknown",

    downlinkMbps:
      typeof connection?.downlink === "number"
        ? round(connection.downlink, 2)
        : null,

    uplinkMbps: null,

    rttMs:
      typeof connection?.rtt === "number"
        ? connection.rtt
        : null,

    saveData:
      connection?.saveData ?? false,

    type:
      connection?.type ??
      "unknown"
  };
}

function getInitialMotion(): MotionTelemetry {
  return {
    supported:
      "DeviceMotionEvent" in window,

    permission: "unknown",

    acceleration: {
      x: 0,
      y: 0,
      z: 0
    },

    rotation: {
      alpha: 0,
      beta: 0,
      gamma: 0
    }
  };
}

export function useDeviceTelemetry() {
  const [telemetry, setTelemetry] =
    useState<DeviceTelemetry | null>(null);

  const [motionPermission, setMotionPermission] =
    useState<
      "granted" |
      "denied" |
      "prompt" |
      "unknown"
    >("unknown");

  const [fps, setFps] = useState(60);

  const batteryRef =
    useRef<any>(null);

  const motionRef =
    useRef<MotionTelemetry>(
      getInitialMotion()
    );

  const workloadRef =
    useRef(0);

  const collect = useCallback(async () => {
    let battery: BatteryTelemetry = {
      supported: false,
      level: null,
      charging: null,
      chargingTime: null,
      dischargingTime: null
    };

    try {
      if (navigator.getBattery) {
        const batteryManager =
          batteryRef.current ??
          await navigator.getBattery();

        batteryRef.current =
          batteryManager;

        battery = {
          supported: true,

          level:
            typeof batteryManager.level ===
            "number"
              ? batteryManager.level * 100
              : null,

          charging:
            typeof batteryManager.charging ===
            "boolean"
              ? batteryManager.charging
              : null,

          chargingTime:
            typeof batteryManager.chargingTime ===
            "number"
              ? batteryManager.chargingTime
              : null,

          dischargingTime:
            typeof batteryManager.dischargingTime ===
            "number"
              ? batteryManager.dischargingTime
              : null
        };
      }
    } catch {
      battery.supported = false;
    }

    const performanceMemory =
      (
        performance as Performance &
          {
            memory?: {
              usedJSHeapSize: number;
            };
          }
      ).memory;

    const pageMemoryMB =
      performanceMemory
        ? performanceMemory.usedJSHeapSize /
          1024 /
          1024
        : null;

    workloadRef.current =
      Math.min(
        100,
        Math.max(
          0,
          workloadRef.current +
            (Math.random() - 0.5) * 5
        )
      );

    setTelemetry({
      timestamp: Date.now(),

      platform:
        navigator.platform || "Unknown",

      userAgent:
        navigator.userAgent,

      language:
        navigator.language,

      cpuCores:
        navigator.hardwareConcurrency ??
        null,

      deviceMemoryGB:
        typeof (
          navigator as ExtendedNavigator
        ).deviceMemory === "number"
          ? (
              navigator as ExtendedNavigator
            ).deviceMemory!
          : null,

      screenWidth:
        window.screen.width,

      screenHeight:
        window.screen.height,

      devicePixelRatio:
        window.devicePixelRatio,

      battery,

      network:
        getNetworkTelemetry(),

      motion: {
  ...motionRef.current,
  ...((window as any).__forgeMotion ?? {})
},

      gpu:
        getGpuTelemetry(),

      pageMemoryMB,

      estimatedWorkload:
        round(workloadRef.current, 1),

      fps
    });
  }, [fps]);

  const requestMotionPermission =
    useCallback(async () => {
      const MotionEvent =
        window.DeviceMotionEvent as any;

      if (
        MotionEvent &&
        typeof MotionEvent.requestPermission ===
          "function"
      ) {
        try {
          const result =
            await MotionEvent.requestPermission();

          setMotionPermission(result);

          if (result === "granted") {
            window.addEventListener(
              "devicemotion",
              handleMotion
            );

            window.addEventListener(
              "deviceorientation",
              handleOrientation
            );
          }
        } catch {
          setMotionPermission("denied");
        }

        return;
      }

      if ("DeviceMotionEvent" in window) {
        setMotionPermission("granted");

        window.addEventListener(
          "devicemotion",
          handleMotion
        );

        window.addEventListener(
          "deviceorientation",
          handleOrientation
        );
      } else {
        setMotionPermission("denied");
      }
    }, []);

  useEffect(() => {
    setMotionPermission("unknown");

    const tick = () => {
      collect();
    };

    tick();

    const interval =
      window.setInterval(
        tick,
        1000
      );

    const online = () => collect();
    const offline = () => collect();

    window.addEventListener(
      "online",
      online
    );

    window.addEventListener(
      "offline",
      offline
    );

    return () => {
      window.clearInterval(interval);

      window.removeEventListener(
        "online",
        online
      );

      window.removeEventListener(
        "offline",
        offline
      );

      window.removeEventListener(
        "devicemotion",
        handleMotion
      );

      window.removeEventListener(
        "deviceorientation",
        handleOrientation
      );
    };
  }, [collect]);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();

    let animationFrame = 0;

    const measure = (
      now: number
    ) => {
      frames++;

      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }

      animationFrame =
        requestAnimationFrame(measure);
    };

    animationFrame =
      requestAnimationFrame(measure);

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  useEffect(() => {
    if (
      batteryRef.current &&
      typeof batteryRef.current.addEventListener ===
        "function"
    ) {
      const battery =
        batteryRef.current;

      const update = () => collect();

      battery.addEventListener(
        "levelchange",
        update
      );

      battery.addEventListener(
        "chargingchange",
        update
      );

      return () => {
        battery.removeEventListener(
          "levelchange",
          update
        );

        battery.removeEventListener(
          "chargingchange",
          update
        );
      };
    }
  }, [collect]);

  return {
    telemetry,
    motionPermission,
    requestMotionPermission
  };
}

function handleMotion(
  event: DeviceMotionEvent
) {
  const acceleration =
    event.accelerationIncludingGravity;

  if (!acceleration) {
    return;
  }

  const current =
    (window as any).__forgeMotion ??
    {};

  (window as any).__forgeMotion = {
    ...current,

    acceleration: {
      x: acceleration.x ?? 0,
      y: acceleration.y ?? 0,
      z: acceleration.z ?? 0
    }
  };
}

function handleOrientation(
  event: DeviceOrientationEvent
) {
  const current =
    (window as any).__forgeMotion ??
    {};

  (window as any).__forgeMotion = {
    ...current,

    rotation: {
      alpha: event.alpha ?? 0,
      beta: event.beta ?? 0,
      gamma: event.gamma ?? 0
    }
  };
}
