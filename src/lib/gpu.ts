import type { GpuTelemetry } from "../types/telemetry";

export function getGpuTelemetry(): GpuTelemetry {
  try {
    const canvas = document.createElement("canvas");

    const gl =
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    if (!gl) {
      return {
        available: false,
        vendor: "Unavailable",
        renderer: "WebGL unavailable"
      };
    }

    const debugInfo = gl.getExtension(
      "WEBGL_debug_renderer_info"
    );

    const vendor = debugInfo
      ? String(
          gl.getParameter(
            debugInfo.UNMASKED_VENDOR_WEBGL
          )
        )
      : String(gl.getParameter(gl.VENDOR));

    const renderer = debugInfo
      ? String(
          gl.getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
          )
        )
      : String(gl.getParameter(gl.RENDERER));

    return {
      available: true,
      vendor,
      renderer
    };
  } catch {
    return {
      available: false,
      vendor: "Unavailable",
      renderer: "Unavailable"
    };
  }
}
