export function getGPUInfo() {
  const canvas = document.createElement("canvas");

  const gl =
    (canvas.getContext("webgl") as WebGLRenderingContext | null) ??
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

  if (!gl) {
    return {
      vendor: "Unknown",
      renderer: "WebGL not supported",
    };
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

  const vendor = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    : "Unknown";

  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "Unknown";

  return {
    vendor: String(vendor),
    renderer: String(renderer),
  };
}
