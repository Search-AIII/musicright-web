import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #00d4aa, #00b4d8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2px solid #080808",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#080808" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
